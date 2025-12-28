const SubscriptionServices = require("../../services/subscription.services");
class SubscriptionController {
    constructor() {
        this.subscriptionServices = SubscriptionServices;
    }

    Subscription = async (req, res) => {
        const studentId = req.user.uid;
        try {
            const subscription = await this.subscriptionServices.create(studentId);
            return res.status(201).json({ message: "Subscription created successfully", data: subscription });
        } catch (error) {
            return res.status(500).json({ message: "Failed to create subscription", error: error.message });
        }
    }

    ShowSubscription = async (req, res) => {
        const studentId = req.user.uid;
        try {
            const subscription = await this.subscriptionServices.getSubscription(studentId);
            return res.status(200).json({ message: "Subscription found", data: subscription });
        } catch (error) {
            return res.status(500).json({ message: "Failed to get subscription", error: error.message });
        }
    }

}

module.exports = new SubscriptionController();