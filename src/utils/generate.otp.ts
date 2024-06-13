// mail.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateOTP {

   OTP = function (length) {
	return Math.floor(
	  Math.pow(10, length - 1) +
		Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
	);
  };
}


