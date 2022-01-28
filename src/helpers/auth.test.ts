import AuthHelper from "./auth";

describe("# Twilio", () => {
  test("Create verification", async () => {
    await AuthHelper.createVerification('+33769238622');
  });

  test("Check verification", async () => {
    const isVerified = await AuthHelper.checkVerification('+33769238622', '231286');
    console.log('isVerified', isVerified);
  });
});