// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // create reusable transporter object using the default SMTP transport
    this.transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "Gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL,   // your SMTP username
        pass: process.env.PASS,    // your SMTP password
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html: string): Promise<void> {
    // setup email data with unicode symbols
    const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Message</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter">
    <script src="https://kit.fontawesome.com/a341ab46f5.js" crossorigin="anonymous"></script>
    <style>
      * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #101928;
}

body {
    width: 70%;
    margin: 0 auto;
    background-color: #F0F2F5 !important;
}

a {
    text-decoration: none;
    color: #000F98;
}

.logo {
    width: 7rem;
    margin: 1.5rem 3.5rem;
}

.logo img {
    width: inherit;
}

.main {
    width: 90%;
    margin: 0 auto 1.5rem;
    padding: 2.5rem;
    background-color: #fff;
    border-radius: 5px;
}

.main h5 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 1.5rem;
}

.main h3 {
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    margin: 1.5rem auto;
    color: #000E8A;
}

.bold {
    margin-top: 2rem;
}

.bold span {
    display: block;
    font-weight: bold;
    line-height: 24px;
}

.main p, .note p {
    font-weight: 400;
    line-height: 24px;
    color: #475367;
}

.main p:nth-of-type(4), .bold span {
    color: #101928;
}

.main p:nth-of-type(1) {
    margin-bottom: 1rem;
}

.main p:nth-of-type(2) {
    margin-bottom: .5rem;
}

.note {
    padding: 0 4.5rem;
    font-size: 14px;
}

.note p:nth-of-type(2) {
    margin-top: 2rem;
}

footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 2rem 0 1rem;
    padding: 0 4rem;
}

footer img {
    width: 6rem;
}

footer div:nth-of-type(2) {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

footer div:nth-of-type(2) a i {
    font-size: 1.5rem;
}



@media screen and (max-width: 837px) {
    body {
        width: 90%;
    }

    .logo {
        margin: 1.5rem 2.5rem;
    }

    .note {
        padding: 0 3.5rem;
    }
    
    footer {
        padding: 0 3rem;
    }
}


@media screen and (max-width: 480px) {
    body {
        width: 95%;
    }
    p {
        font-size: 14px;
    }
    
    .logo {
        width: 6rem;
        margin: 1.5rem;
    }

    .main h5 {
        font-size: 20px;
    }
    
    .main h3 {
        font-size: 28px;
    }

    .bold span {
        font-size: 14px;
    }

    .note {
        padding: 0 2.5rem;
        font-size: 12px;
    }
    
    footer {
        padding: 0 2rem;
    }

    footer img {
        width: 5rem;
    }

    footer div:nth-of-type(2) {
        gap: 1rem;
    }

    footer div:nth-of-type(2) a i {
        font-size: 1.2rem;
    }
}
    </style>
    
</head>
<body>
    <header class="logo">
        <img src="https://res.cloudinary.com/michstery/image/upload/v1724075222/logo_wxqp8i.png" alt="workwise logo">
    </header>

    <div class="main">
        <h5>Verify your Email</h5>
        <p>Dear <span id="userName">User,</span></p>
        <p>Kindly verify your email address  to ensure we finish setting up your account.</p>
        <p>Please use the 6-digit codes below to verify your email address.</p>
        
        <h3> ${html} </h3>

        <p>
            Please be aware that your OTP should never be shared with anyone. Our staff will never request your password or OTP under any circumstances. Please exercise caution and do not disclose this information to anyone.
        </p>

        <p class="bold">
            <span>Best Wishes</span>
            <span>Support</span>
        </p>
    </div>

    <footer>
        <div>
            <img src="https://res.cloudinary.com/michstery/image/upload/v1724075222/logo_wxqp8i.png" alt="workwise logo">
        </div>
        <div>
            <a href="#"><i class="fa-brands fa-twitter"></i></a>
            <a href="#"><i class="fa-brands fa-facebook"></i></a>
            <a href="#"><i class="fa-brands fa-linkedin"></i></a>
        </div>
    </footer>
</body>
</html>`
    const textBody = text;
    const mailOptions = {
      from: 'Work-Wise', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: textBody, // plain text body
      html: htmlBody, // html body
    };

    // send mail with defined transport object
    await this.transporter.sendMail(mailOptions);
  }
}
