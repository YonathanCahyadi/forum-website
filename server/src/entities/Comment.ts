import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 as uuid } from "uuid";
import { Thread } from "./Thread";
import { User } from "./User";

@ObjectType()
@Entity({ tableName: "Comments" })
export class Comment {
  @Field()
  @PrimaryKey()
  id: string = uuid();

  @Field(() => Thread)
  @ManyToOne(() => Thread)
  post!: Thread;

  @Field(() => User)
  @ManyToOne(() => User)
  createdBy!: User;

  @Field()
  @Property({ nullable: false })
  content!: string;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field()
  @Property()
  updated: boolean = false;

  @Property()
  deleted: boolean = false;
}
