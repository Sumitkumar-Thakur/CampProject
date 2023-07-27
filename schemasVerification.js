import Joi from "joi";
export const campgroundScheme = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required(),
        deleteImages: Joi.array(),
    }).required()
})

export const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.string().required().min(1).max(5),
        body: Joi.string().required(),
    }).required()
})


//sheesh Joi is good