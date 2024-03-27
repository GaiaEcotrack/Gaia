import { GearKeyring, IUpdateVoucherParams } from '@gear-js/api';
import { useAccount, useApi, useAlert, useBalanceFormat } from '@gear-js/react-hooks';


const useVoucherUtils = () => {
    const ONE_TVARA_VALUE = 1_000_000_000_000
    const program = import.meta.env.VITE_APP_MAIN_CONTRACT_ID
    const { getFormattedBalanceValue } = useBalanceFormat();
    const { api } = useApi();
    const { account } = useAccount();
    const alert = useAlert();

    const createNewVoucher = (): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            if (!api || !account) {
                console.log("No se inicio la api o account");
                reject("Error creating voucher");
                return;
            }


            const creatingVoucherAlertId = alert.loading("Creating voucher");

            // Se genera el "issue" para crear el voucher para el usuario
            // En este caso, para el main contract
            const voucherIssued =  await api.voucher.issue(
                account?.decodedAddress ?? "0x00",
                ONE_TVARA_VALUE * 11, // 11 TVaras
                1_200, // An hour in blocks
                [program]
            );

            console.log("voucher issued");

            const mnemonic = 'sun pill sentence spoil ripple october funny ensure illness equal car demise';
            const { seed } = GearKeyring.generateSeed(mnemonic);
        
            const keyring = await GearKeyring.fromSeed(seed, 'admin');

            // Se firma el voucher con la cuenta del administrador para el main Contract

            try {
                await voucherIssued.extrinsic.signAndSend(
                    keyring,
                    async (event) => {
                        console.log(event.toHuman()); 
                        const extrinsicJSON: any = event.toHuman();
                        if (extrinsicJSON && extrinsicJSON.status !== "Ready") {
                            const objectKey = Object.keys(extrinsicJSON.status)[0];
                            if (objectKey === "Finalized") {
                                alert.remove(creatingVoucherAlertId);
                                alert.success("Voucher created");
                                console.log("Voucher created");
                                resolve(voucherIssued.voucherId);
                            }
                        }
                    }
                );
            } catch (error: any) {
                console.error(`${error.name}: ${error.message}`);
                alert.remove(creatingVoucherAlertId);
                alert.error("Error creating voucher");
                reject("Error creating voucher");
            }
        });
    }

    const voucherExpired = async (voucherId: string): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            if (!api || !account) {
                console.log("Api or Account is not ready");
                reject(false);
                return;
            }
    
            const voucherData = await api.voucher.getDetails(account.decodedAddress, voucherId);
            const blockHash = await api.blocks.getFinalizedHead();
            const blocks = await api.blocks.getBlockNumber(blockHash as Uint8Array);
    
            resolve(blocks.toNumber() > voucherData.expiry);
        });
    }

    const voucherBalance = async (voucherId: string): Promise<number> => {
        return new Promise(async (resolve, reject) => {
            if (!api || !account) {
                console.log("api or account is not ready");
                reject(false);
                return;
            }

            const voucherBalance = await api.balance.findOut(voucherId);
            const voucherBalanceFormated = Number(getFormattedBalanceValue(voucherBalance.toString()).toFixed());

            resolve(voucherBalanceFormated);
        });
    }

    const voucherExists = async (): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            if (!api || !account) {
                console.log("api or account is not ready");
                reject(false);
                return;
            }

            const vouchers = await api.voucher.getAllForAccount(account?.decodedAddress, program);

            resolve(
                Object.keys(vouchers).length > 0
            );
        });
    }

    const accountVoucherId = async (): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            if (!api || !account) {
                console.log("api or account is not ready");
                reject(false);
                return;
            }

            const vouchersData = await api.voucher.getAllForAccount(account?.decodedAddress, program);
            const vouchersId = Object.keys(vouchersData);

            if (vouchersId.length < 1) {
                console.log("User does not has voucher");
                reject(false);
                return;
            }

            resolve(vouchersId[0]);
        });
    }

    const renewVoucherOneHour = async (voucherId: string): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            if (!api || !account) {
                console.log("Api or Account is not ready");
                reject(false);
                return;
            }
            const renewVoucherAlertId = alert.loading("Renewing voucher");

            const newVoucherData: IUpdateVoucherParams = {
                prolongDuration: 1_200 // one hour
            }

            const voucherUpdate = api.voucher.update(
                account.decodedAddress, 
                voucherId, 
                newVoucherData
            );
            const mnemonic = 'sun pill sentence spoil ripple october funny ensure illness equal car demise';
            const { seed } = GearKeyring.generateSeed(mnemonic);
        
            const keyring = await GearKeyring.fromSeed(seed, 'admin');

            try {
                await voucherUpdate.signAndSend(
                    keyring,
                    async (event) => {
                        console.log(event.toHuman()); 
                        const extrinsicJSON: any = event.toHuman();
                        if (extrinsicJSON && extrinsicJSON.status !== "Ready") {
                            const objectKey = Object.keys(extrinsicJSON.status)[0];
                            if (objectKey === "Finalized") {
                                alert.remove(renewVoucherAlertId);
                                alert.success("Voucher updated");
                                console.log("Voucher updated");
                                resolve(true);
                            }
                        }
                    }
                );
            } catch (error: any) {
                alert.remove(renewVoucherAlertId);
                alert.error("Error renewing voucher");
                console.error(`${error.name}: ${error.message}`);
                reject(false);
            }
        });
    }

    const addTwoTokensToVoucher = async (voucherId: string): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            if (!api || !account) {
                console.log("Api or Account is not ready");
                reject(false);
                return;
            }


            const renewVoucherAlertId = alert.loading("Adding tokens to voucher");

            const newVoucherData: IUpdateVoucherParams = {
                balanceTopUp: ONE_TVARA_VALUE * 2
            }

            const voucherUpdate = api.voucher.update(
                account.decodedAddress, 
                voucherId, 
                newVoucherData
            );

            const mnemonic = 'sun pill sentence spoil ripple october funny ensure illness equal car demise';
            const { seed } = GearKeyring.generateSeed(mnemonic);
        
            const keyring = await GearKeyring.fromSeed(seed, 'admin');

            try {
                await voucherUpdate.signAndSend(
                    keyring,
                    async (event) => {
                        console.log(event.toHuman()); 
                        const extrinsicJSON: any = event.toHuman();
                        if (extrinsicJSON && extrinsicJSON.status !== "Ready") {
                            const objectKey = Object.keys(extrinsicJSON.status)[0];
                            if (objectKey === "Finalized") {
                                alert.remove(renewVoucherAlertId);
                                alert.success("Voucher updated");
                                console.log("Voucher updated");
                                resolve(true);
                            }
                        }
                    }
                );
            } catch (error: any) {
                alert.remove(renewVoucherAlertId);
                alert.error("Error adding tokens to voucher");
                console.error(`${error.name}: ${error.message}`);
                reject(false);
            }
        });
    }

    return { 
        createNewVoucher, 
        voucherExpired, 
        voucherBalance, 
        voucherExists, 
        renewVoucherOneHour,
        accountVoucherId,
        addTwoTokensToVoucher
    };
}

export default useVoucherUtils;