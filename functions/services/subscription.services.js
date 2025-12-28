const SubscriptionRepository = require("../repositories/subscription/subscription.repository");

class SubscriptionServices {
    constructor() {
        this.subscriptionRepository = SubscriptionRepository;
    }

    async create(studentId) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        return await this.subscriptionRepository.create(studentId, startDate, endDate);
    }

    async getSubscription(studentId) {
        return await this.subscriptionRepository.getSubscription(studentId);
    }
}

module.exports = new SubscriptionServices();
