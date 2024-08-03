import axios from "axios";

async function createCoupon() {
    let code = `${Math.ceil(Math.random() * 1000000)}`;

    const data = {
        promotionCodeData: {
            data: [
                {
                    code: `TRUTS${code}`,
                },
            ],
        },
        name: `TRUTS${code}`,
        percentOff: 50,
        maxRedemptions: 1,
    };

    try {
        const response = await axios.post(
            "https://api.copperx.io/api/v1/coupons",
            data,
            {
                headers: {
                    accept: "application/json",
                    authorization:
                        "Bearer pav1_vuvMl2HzYWK4IHIuTzdnnrL19MMvaRsgqGWEIS6meEM4ZJA9AYYlvrYMFtkYPupU",
                    "content-type": "application/json",
                },
            }
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
}

export default async (req, res) => {
    let coupon = await createCoupon();
    console.log(coupon)
    res.send({
        code: coupon.promotionCodes[0].code,
        name: coupon.name,
        percentOff: coupon.percentOff
    })
}