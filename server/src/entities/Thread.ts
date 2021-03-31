import { Collection, Entity, IdentifiedReference, ManyToOne, OneToMany, PrimaryKey, Property, Reference } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 as uuid } from "uuid";
import { Comment } from "./Comment";
import { User } from "./User";

@ObjectType()
@Entity({ tableName: "Threads" })
export class Thread {
  @Field()
  @PrimaryKey()
  id: string = uuid();

  @Field(() => User)
  @ManyToOne(() => User)
  createdBy!: User;

  @Field()
  @Property({ nullable: false })
  title!: string;

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
