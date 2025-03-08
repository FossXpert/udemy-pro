"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutByType = exports.editLayout = exports.createLayout = exports.getAllCategory = exports.editCategory = exports.createCategory = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const layout_1 = __importDefault(require("../models/layout"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const errorHandlers_1 = __importDefault(require("../utills/errorHandlers"));
const category_1 = __importDefault(require("../models/category"));
exports.createCategory = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const category = await category_1.default.findOne();
        const categoryName = req.body.categoryName;
        console.log(category, categoryName);
        if (!category) {
            return next(new errorHandlers_1.default(`Failed to create category : ${categoryName}`, 400));
        }
        const isCategoryExist = category.categories.find((a) => a.categoryName === categoryName);
        console.log(isCategoryExist);
        if (isCategoryExist) {
            return next(new errorHandlers_1.default("Category already Exist", 400));
        }
        if (isCategoryExist === undefined || isCategoryExist === null) {
            const newCategory = {
                categoryName: categoryName,
                containedCourses: [],
            };
            category.categories.push(newCategory);
        }
        await category.save();
        return res.status(201).json({
            success: true,
            category
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.editCategory = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const categoryDetails = req.body;
        const cat = await category_1.default.findOne({});
        await category_1.default.findByIdAndUpdate(cat?._id, categoryDetails);
        await cat?.save();
        return res.status(201).json({
            success: true,
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.getAllCategory = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const allCategory = await category_1.default.findOne();
        return res.status(201).json({
            success: true,
            allCategory
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
// wasted
//Cretae layouut
exports.createLayout = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { type } = req.body;
        const isTypeExist = await layout_1.default.findOne({ type });
        if (isTypeExist) {
            return next(new errorHandlers_1.default(`${type} already exist`, 400));
        }
        console.log(type);
        if (type === 'banner') {
            const { image, title, subtitle } = req.body;
            const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
                folder: "layout"
            });
            const banner = {
                type: "banner",
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url
                    },
                    title, subtitle
                }
            };
            await layout_1.default.create(banner);
            return res.status(201).json({
                success: true,
                message: "Banner Created Successfully"
            });
        }
        if (type === 'faq') {
            const { faq } = req.body;
            const faqItems = await Promise.all(faq.map(async (items) => {
                return {
                    question: items.question,
                    answer: items.answer
                };
            }));
            await layout_1.default.create({ type: 'faq', faq: faqItems });
            return res.status(201).json({
                success: true,
                message: "FAQ Created Successfully"
            });
        }
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
exports.editLayout = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { type } = req.body;
        console.log(type);
        if (type === 'banner') {
            const bannerData = await layout_1.default.findOne({ type: 'banner' });
            const { image, title, subtitle } = req.body;
            const data = image.startsWith("https") ?
                bannerData : await cloudinary_1.default.v2.uploader.upload(image, {
                folder: "layout",
            });
            const banner = {
                type: "banner",
                image: {
                    public_id: image.startsWith("https")
                        ? bannerData?.banner.image.public_id
                        : data?.public_id,
                    url: image.startsWith("https")
                        ? bannerData?.banner.image.url
                        : data?.secure_url,
                },
                title,
                subtitle,
            };
            console.log("bannerData", banner);
            await layout_1.default.findByIdAndUpdate(bannerData?._id, { banner });
            return res.status(201).json({
                success: true,
                message: "Banner updated Successfully"
            });
        }
        if (type === 'faq') {
            const { faq } = req.body;
            const faqData = await layout_1.default.findOne({ type: 'faq' });
            if (!faqData) {
                return next(new errorHandlers_1.default('faq database is empty', 400));
            }
            await layout_1.default.findByIdAndUpdate(faqData._id, { type: 'faq', faq: faq });
            return res.status(201).json({
                success: true,
                message: "faq updated Successfully"
            });
        }
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
//getLayout by type
exports.getLayoutByType = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { type } = req.params;
        const layout = await layout_1.default.findOne({ type: type });
        if (!layout) {
            return next(new errorHandlers_1.default('Falied to find Layout', 400));
        }
        return res.status(201).json({
            success: true,
            layout
        });
    }
    catch (error) {
        return next(new errorHandlers_1.default(error.message, 400));
    }
});
