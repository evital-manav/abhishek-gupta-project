import bcrypt from "bcrypt";

export class filefunctions {
  async hashPassword(password: string) {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async comparePassword(inputPassword: string, userPassword: string) {
    try {
      return await bcrypt.compare(inputPassword, userPassword);
    } catch (error) {
      throw new Error("Error comparing password");
    }
  }
}
