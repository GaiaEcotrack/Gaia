// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
import twilio from "twilio";
import { createInterface } from "readline";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VA42ee565aa2f0e6c3329eda1588a36df0";
const client = twilio(accountSid, authToken);

client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+573105743546", channel: "sms" })
  .then(async (verification: any) => {
    console.log(verification.status);

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const otpCode = await new Promise<string>((resolve) => {
      rl.question("Please enter the OTP:", (otp: string) => {
        resolve(otp);
      });
    });

    await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({
        to: "+573105743546",
        code: otpCode as string, // Asigna el tipo de la variable
      })
      .then((verification_check: any) => console.log(verification_check.status));

    rl.close();
  });
