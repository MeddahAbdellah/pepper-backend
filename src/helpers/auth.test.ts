import AuthHelper from "helpers/auth";

// TODO: mock twilio and spy on it's calls
describe("# Twilio", () => {
  test.skip("Create verification", async () => {
    await AuthHelper.createVerification('+33769238622');
  });

  test.skip("Check verification", async () => {
    const isVerified = await AuthHelper.checkVerification('+33769238622', '231286');
    console.log('isVerified', isVerified);
  });
});