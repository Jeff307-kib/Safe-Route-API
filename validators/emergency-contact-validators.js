import { body } from "express-validator";

const contactValidator = {
    create: [
        //checking dulplicates
        body("contactUserId")
            .isInt()
            .withMessage("contactUserId must be an integer")
            .custom((value, { req }) => {
        if (value === req.user.id) {
            throw new Error("You cannot add yourself as an emergency contact");
        }
        return true;
    }),
        body("relationship")
            .isIn(['parent', 'friend', 'partner', 'colleague'])
            .withMessage("Invalid relationship type"),
        body("notes")
            .optional()
            .isString()
            .withMessage("Notes must be a string")
            .isLength({ max: 500 })
            .withMessage("Notes cannot exceed 500 characters")
    ],
    update: [
        body("relationship")
            .optional()
            .isIn(['parent', 'friend', 'partner', 'colleague'])
            .withMessage("Invalid relationship type"),
        body("notes")
            .optional()
            .isString()
            .isLength({ max: 500 })
    ]
};

export default contactValidator;