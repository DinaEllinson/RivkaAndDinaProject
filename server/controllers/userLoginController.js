
import { UserLoginService } from "../service/userLoginService.js";
import { verifyRecaptcha } from "../service/recaptchaService.js";

export class UserLoginController {
    //post
    async checkUserLogin(req, res, next) {
        try {
            const { token, ...userData } = req.body;
            const isRecaptchaValid = await verifyRecaptcha(token);

            // Check reCAPTCHA validation result
            if (!isRecaptchaValid.success) {
                return res.status(400).json({ message: 'reCAPTCHA verification failed.' });
            }

            const userLoginService = new UserLoginService();
            console.log(userData.data)

            const  jwtToken = await userLoginService.checkUserLogin(userData.data);
            res.cookie('x-access-token', jwtToken, { httpOnly: true, secure: true, maxAge: 259200000 })
               .json({ token: jwtToken })

        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }
    // get
    async getUserLogin(req, res, next) {
        try {
            const userLoginService = new UserLoginService();
            const resultItem = await userLoginService.getUserLogin(req.query);
            return res.status(200).json(resultItem);
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }

    async editUserLogin(req, res, next) {
        try {
            const userLoginService = new UserLoginService();
            await userLoginService.updateLogin(req.body, req.params.id);
            res.status(200).json({ status: 200 })
        }
        catch (ex) {
            const err = {}
            err.statusCode = 500;
            err.message = ex;
            next(err)
        }
    }
}
