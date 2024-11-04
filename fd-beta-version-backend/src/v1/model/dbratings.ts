import { appdb } from "./appdb";

export class dbRatings extends appdb {
  constructor() {
    super();
    this.table = "rating";
    this.uniqueField = "id";
  }

  async insertRating(restaurantId: number, rating: number, userId: number): Promise<any> {
    const ratingData = {
      restaurant_id: restaurantId,
      rating: rating,
      user_id: userId,
    };

    try {
      const result = await this.insertRecord(ratingData);
      return result;
    } catch (error) {
      console.log("Error creating rating:", error);
     
    }
  }
}
