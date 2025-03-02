"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const layoutController_1 = require("../controllers/layoutController");
const userController_1 = require("../controllers/userController");
const layoutRouter = express_1.default.Router();
layoutRouter.post('/createlayout', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), layoutController_1.createLayout);
layoutRouter.get('/getallcategory', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), layoutController_1.getAllCategory);
layoutRouter.post('/createcategory', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), layoutController_1.createCategory);
layoutRouter.put('/editcategory', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), layoutController_1.editCategory);
layoutRouter.put('/editlayout', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), layoutController_1.editLayout);
layoutRouter.get('/getlayoutbytype/:type', userController_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)('admin'), layoutController_1.getLayoutByType);
exports.default = layoutRouter;
