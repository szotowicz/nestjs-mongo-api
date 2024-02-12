import {
  IsDate,
  IsEmail,
  IsEnum,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  validateSync,
} from 'class-validator';
import { Row } from 'read-excel-file';
import { ReservationStatus } from './reservation.schema';

export class ReservationParsed {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  _id: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  lastName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDate()
  @IsNotEmpty()
  from: Date;

  @IsDate()
  @IsNotEmpty()
  to: Date;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ReservationStatus)
  status: string;

  @IsOptional()
  @IsNumberString({ no_symbols: true })
  phone?: string;

  @IsOptional()
  @IsISO31661Alpha2()
  country?: string;

  constructor(row: Row) {
    this._id = row[7]?.toString();
    this.firstName = row[0]?.toString();
    this.lastName = row[1]?.toString();
    this.email = row[2]?.toString();
    this.from = new Date(row[3]?.toString());
    this.to = new Date(row[4]?.toString());
    this.status = row[6]?.toString()?.toUpperCase();
    this.phone = row[8]?.toString();
    this.country = row[9]?.toString()?.toUpperCase();
  }

  static parse(row: Row): ReservationParsed {
    if (row.length < 10) {
      return null;
    }
    const reservation = new ReservationParsed(row);
    const validationErrors = validateSync(reservation);
    if (validationErrors.length || reservation.from >= reservation.to) {
      return null;
    }
    return reservation;
  }
}
