import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum ReservationStatus {
  RESERVED = 'RESERVED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Schema({ collection: 'reservations', timestamps: true })
export class Reservation {
  @Prop()
  _id: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  from: string;

  @Prop()
  to: string;

  @Prop({ enum: ReservationStatus })
  status: ReservationStatus;

  @Prop({ required: false })
  phone?: string;

  @Prop({ required: false })
  country?: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
