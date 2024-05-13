import { Document } from "mongoose";


interface GenreInterface extends Document {
    id: number,
    name: string,
    english_name: string
}


export default GenreInterface;