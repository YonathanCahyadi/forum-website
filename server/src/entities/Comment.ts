import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 as uuid } from "uuid";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity({ tableName: "Comments" })
export class Comment {
  @Field()
  @PrimaryKey()
  id: string = uuid();

  @Field(() => Post)
  @ManyToOne(() => Post)
  post!: Post;

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
