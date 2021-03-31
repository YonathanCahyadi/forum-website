import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 as uuid } from "uuid";
import { Comment } from "./Comment";
import { Thread } from "./Thread";

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

  @Field(() => [Thread])
  @OneToMany(() => Thread, (post) => post.createdBy)
  threads = new Collection<Thread>(this);

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
