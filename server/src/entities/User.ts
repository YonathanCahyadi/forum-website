import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 as uuid } from "uuid";
import { Comment } from "./Comment";
import { Post } from "./Post";

@ObjectType()
@Entity({ tableName: "Users" })
export class User {
  @Field()
  @PrimaryKey()
  id: string = uuid();

  @Field()
  @Property({ nullable: false, unique: true })
  username!: string;

  @Property({ nullable: false })
  password!: string;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.createdBy)
  post = new Collection<Post>(this);

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.createdBy)
  comments = new Collection<Comment>(this);

  @Property()
  deleted: boolean = false;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
