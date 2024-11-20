import fs from "fs";

import path from "path";

export class functions {
  constructor() {}

  /**
   * Function to convert date in Long date format
   * @param date Date
   * @param showtime if want to show time or not
   * @returns date in format of "02 Aug 2019" or "02 Aug 2019 12:47 PM"
   */

  /**
   * Send output to client with status code and message
   * @param status_code status code of a response
   * @param status_message status message of a response
   * @param data response data
   * @returns object with 3 parameters
   */
  output(status_code: number, status_message: any, data: any = null) {
    let output = {
      status_code: status_code.toString(),
      status_message: status_message,
      data: data,
    };

    return output;
  }
}
