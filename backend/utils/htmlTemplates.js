export const codeVerificatonTemplate = (code,appName="")=>
{
return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appName} - Email Verification</title>
    <style>
        body {
            background-color: #ffffff;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            color: #333333;
            font-size: 32px;
            margin: 0;
        }
        .content {
            background-color: #f7f7f7;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .content h2 {
            font-size: 24px;
            color: #333333;
            margin-bottom: 20px;
        }
        .verification-code {
            font-size: 28px;
            font-weight: bold;
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
            letter-spacing: 5px;
            display: inline-block;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #777777;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <h1>${appName}</h1>
        </div>

        <!-- Content Section -->
        <div class="content">
            <h2>Verify Your Account</h2>
            <p>Please use the 6-digit verification code below to verify your account:</p>
            <div class="verification-code">
                ${code}
            </div>
        </div>

        <!-- Footer Section -->
        <div class="footer">
            <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
    </div>
</body>
</html>



`

}


export const contactMessageTemplate = (user, email, message, appName) => {
  const year = new Date().getFullYear();
  const safeMessage = message.replace(/\n/g, "<br>");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>New Message</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      .preheader { display:none !important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; }
      @media (max-width: 480px) {
        .container { width:100% !important; }
        .px { padding-left:16px !important; padding-right:16px !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background:#ffffff;">
    <div class="preheader">You received a new message from your website.</div>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#ffffff;">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="600" style="width:600px; max-width:600px; border:1px solid #000; border-collapse:separate; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td class="px" style="padding:20px 24px; background:#000; color:#fff; font-family:Arial, Helvetica, sans-serif; font-size:18px; font-weight:bold; letter-spacing:.5px;">
                New Message
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td class="px" style="padding:24px; background:#fff; color:#000; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:1.6;">
                <p style="margin:0 0 12px 0;">Hi,</p>
                <p style="margin:0 0 20px 0;">You’ve received a new message via your website contact form.</p>

                <!-- Info rows -->
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; margin:0 0 16px 0;">
                  <tr>
                    <td style="padding:8px 0; width:120px; color:#666; font-size:12px;">Name</td>
                    <td style="padding:8px 0; color:#000; font-size:14px; font-weight:bold;">${user}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; width:120px; color:#666; font-size:12px;">Email</td>
                    <td style="padding:8px 0; color:#000; font-size:14px; text-decoration:underline;">
                      <a href="mailto:${email}" style="color:#000; text-decoration:underline;">${email}</a>
                    </td>
                  </tr>
                </table>

                <!-- Message box -->
                <div style="border:1px solid #000; border-radius:6px; padding:16px; background:#fff; color:#000; font-size:14px; line-height:1.6;">
                  ${safeMessage}
                </div>

                <p style="margin:20px 0 0 0; color:#666; font-size:12px;">This email was generated automatically.</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="px" style="padding:12px 24px; background:#f7f7f7; color:#000; font-family:Arial, Helvetica, sans-serif; font-size:12px; text-align:center; border-top:1px solid #000;">
                © ${year} ${appName}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};



export const orderConfirmationTemplate = (customerName="Sir", orderItems,appName="") => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .email-container {
        background-color: #ffffff;
        margin: 20px auto;
        max-width: 600px;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333333;
        text-align: center;
      }
      .content {
        color: #666666;
        line-height: 1.6;
      }
      .order-summary {
        margin: 20px 0;
        border-collapse: collapse;
        width: 100%;
      }
      .order-summary th, .order-summary td {
        text-align: left;
        padding: 8px 10px;
        border: 1px solid #ddd;
      }
      .order-summary th {
        background-color: #00d9ff;
        color: white;
      }
      .order-summary tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        color: #888888;
        font-size: 12px;
      }
      .button {
        background-color: #00d9ff;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        text-decoration: none;
        display: inline-block;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h1>Order Confirmation</h1>
      <p class="content">
        Dear ${customerName},
      </p>
      <p class="content">
        Thank you for your order from <strong>${appName}</strong>! We’re excited to let you know that your order has been successfully placed.
      </p>
      <h2>Order Summary</h2>
      <table class="order-summary" width="100%">
        <tr>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
        ${orderItems
          .map(
            (e) => `
        <tr>
          <td>${e.name}</td>
          <td>${e.quantity}</td>
          <td>${e.price}</td>
        </tr>`
          )
          .join("")}
      </table>
      <p class="content">
        You will receive a notification once your order has been shipped. If you have any questions, feel free to contact us.
      </p>
      <div class="footer">
        <p>
          &copy; 2025 ${appName}. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>`;



export const orderStatusChangedTemplate = (
  customerName = "Sir",
  orderId,
  newStatus,
  APPNAME
) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Status Update</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .email-container {
        background-color: #ffffff;
        margin: 20px auto;
        max-width: 600px;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333333;
        text-align: center;
      }
      .content {
        color: #666666;
        line-height: 1.6;
      }
      .status-box {
        margin: 20px 0;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background-color: #f9f9f9;
        font-size: 16px;
      }
      .status-label {
        font-weight: bold;
        color: #333;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        color: #888888;
        font-size: 12px;
      }
      .button {
        background-color: #00d9ff;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        text-decoration: none;
        display: inline-block;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h1>Order Status Update</h1>
      <p class="content">
        Dear ${customerName},
      </p>
      <p class="content">
        We wanted to let you know that the status of your order 
        <strong>#${orderId}</strong> has been updated.
      </p>
      <div class="status-box">
        <span class="status-label">Current Status:</span> ${newStatus}
      </div>
      <p class="content">
        You will receive further notifications as your order progresses. 
        Thank you for shopping with <strong>${APPNAME}</strong>!
      </p>
      
      <div class="footer">
        <p>
          &copy; 2025 ${APPNAME}. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>`;
