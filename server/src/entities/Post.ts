import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 as uuid } from "uuid";
import { Comment } from "./Comment";
import { User } from "./User";

@ObjectType()
@Entity({ tableName: "Posts" })
export class Post {
  @Field()
  @PrimaryKey()
  id: string = uuid();

  @Field(() => User)
  @ManyToOne(() => User)
  createdBy!: User;

  @Field()
  @Property({ type: "text", nullable: false })
  content!: string;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.post)
  comments = new Collection<Comment>(this);

  @Field()
  @Property()
  updated: boolean = false;

  @Property()
  deleted: boolean = false;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
