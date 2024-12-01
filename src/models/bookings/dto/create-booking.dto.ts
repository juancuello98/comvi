export class CreateBookingDto {
    readonly userId: string;
    readonly roomId: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly status: string;

    constructor(userId: string, roomId: string, startDate: Date, endDate: Date, status: string) {
        this.userId = userId;
        this.roomId = roomId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
}