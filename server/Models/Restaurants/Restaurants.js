import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
    },
    menu: {
        type: Array,
        default: [],
        item_id: {
            type: String
        },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true
            },
            inStock: {
                type: Number,
                required: true
            }
    },
    orderHistory: {
        type: Array,
        default: [],
        orderDetails: {
                type: Object,
                customer_name: {
                    type: String,
                    required: true
                },
                customer_phone: {
                    type: String,
                    required: true
                },
                item_name: {
                    type: String,
                    required: true
                },
                item_quantity: {
                    type: Number,
                    required: true
                },
                total: {
                    type: Number,
                    required: true
                }
        }
    },

    currentOrder: {
        type: Array,
        default: [],
        order: {
            customer_name: {
                type: String,
                required: true
            },
            customer_phone: {
                type: String,
                required: true
            },
            item_name: {
                type: String,
                required: true
            },
            item_quantity: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                requried: true
            }
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        email: {
            type: Boolean,
            default: false
        },
        phone: {
            type: Boolean,
            default: false
        }
    },
    verificationToken: {
        email: {
            type: String,
            default: null
        },
        phone: {
            type: String,
            default: null
        }
    }
}, {
    timestamps: true
});

const restaurantModel = mongoose.model("restaurants", restaurantSchema);

export default restaurantModel;