import { body, validationResult } from "express-validator";

const registerValidator = [
    body("name").trim()
        .notEmpty().withMessage("Name is required")
        .isAlpha().withMessage("Only alphabets are allowed")
        .isLength({ min:3, max:25 }).withMessage("Minimum 3 characters and maximum 25 characters are allowed"),

    body("email").trim()
        .notEmpty().withMessage("Email ID is required")
        .isEmail().withMessage("Enter a valid Email ID"),
    
    body("phone").trim()
        .notEmpty().withMessage("Mobile number is required")
        .isMobilePhone().withMessage("Enter a valid mobile number"),

    body("password").trim()
        .notEmpty().withMessage("password is required")
        .isLength({ min: 6, max: 12}).withMessage("Password must be atleast 6 characters and maximum 12 characters"),

    body("location").trim()
        .notEmpty().withMessage("Please enter your address")
];

const loginValidator = [
    body("email").trim()
        .notEmpty().withMessage("Email ID is required")
        .isEmail().withMessage("Enter a valid Email ID"),

    body("password").trim()
        .notEmpty().withMessage("Password is required")
]

function errorValidation(req, res, next)
{
    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(400).json({
            error: errors.array()
        });
    }
    next();
}

export { registerValidator, loginValidator, errorValidation };