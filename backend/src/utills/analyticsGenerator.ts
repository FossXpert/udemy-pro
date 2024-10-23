import { Document, Model } from "mongoose";

interface MonthData {
    month: string;
    count: string;
}

export async function generateLast12MonthsData<T extends Document>(model: Model<T>): Promise<{ last12months: MonthData[] }> {
    const last12months: MonthData[] = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    for (let i = 11; i >= 0; i--) {
        const endDate = new Date(currentDate.getFullYear(),
            currentDate.getMonth(), currentDate.getDate() - i * 28);
        const startDate = new Date(currentDate.getFullYear(),
            currentDate.getMonth(), currentDate.getDate() - 28);

        const monthYear = endDate.toLocaleDateString("default", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        const count = await model.countDocuments({
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        });
        last12months.push({ month: monthYear, count: count.toString() });
    }
    return { last12months };
}