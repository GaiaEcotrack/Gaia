    import React from 'react'
    import { PayPalButtons } from '@paypal/react-paypal-js'

    interface PaypalButtonInterFace {
        totalValue: string
        invoice: string
    }
    const PaypalButton : React.FC<PaypalButtonInterFace> = (props) => {
        return (
            <PayPalButtons 
            createOrder={(data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            description: props.invoice,
                            amount: {
                                value: props.totalValue
                            }
                        }
                    ]
                })
            }}

            onApprove={ async (data, actions) =>{
                const order = await actions.order?.capture()
                console.log("order", order)
                // Envía la información al backend
                fetch('http://localhost:5000/users/paypal/transaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        orderId: order?.id,
                        payerId: order?.payer.payer_id,
                        paymentId: order.purchase_units[0].payments.captures[0].id,
                        totalValue: props.totalValue,
                        invoice: props.invoice
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            }}
            />
        )
    }

    export default PaypalButton
