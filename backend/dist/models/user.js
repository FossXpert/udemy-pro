"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
require('dotenv').config();
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: {
            validator: function (value) {
                return emailRegexPattern.test(value);
            }
        },
        message: 'Please enter a valid email'
    },
    purchased: { type: Number, default: 0 },
    password: {
        type: String,
        required: [false, 'Please enter your password'],
        minlength: [6, 'Your password must be at least 6 characters long'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        }
    },
    role: {
        type: String,
        default: 'admin',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            courseId: String,
        }
    ],
    postedCourse: [
        {
            type: mongoose_1.Types.ObjectId, ref: 'udemy-course'
        }
    ]
}, { timestamps: true });
//Bcrypting Password - Remember
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    next();
});
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
userSchema.methods.signAccessToken = async function () {
    const token = jsonwebtoken_1.default.sign({ id: this._id }, process.env.ACCESS_TOKEN, {
        expiresIn: '5m'
    });
    return token;
};
userSchema.methods.signRefreshToken = async function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.REFRESH_TOKEN, {
        expiresIn: '3d'
    });
};
exports.userModel = mongoose_1.default.model('udemy-user', userSchema);
