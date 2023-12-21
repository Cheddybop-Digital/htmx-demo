import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity() // sql table === 'user'
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  avatarUrl: string;
}
