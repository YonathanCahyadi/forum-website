import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import AppContext from "../types/AppContext";
import { User } from "../entities/User";
import argon2 from "argon2";
import { __jwt_secret__ } from "../env";
import { createToken } from "../lib/authentication";

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  data?: User;

  @Field(() => String, { nullable: true })
  authorizationToken?: string;

  @Field(() => String, { nullable: true })
  error?: string;
}

@Resolver()
export class UserResolver {
  private MIN_USERNAME_LENGTH = 5;
  private MIN_PASSWORD_LENGTH = 8;

  private isValid(username: string, password: string): { valid: boolean; msg?: string } {
    if (username.length < this.MIN_USERNAME_LENGTH) {
      return {
        valid: false,
        msg: `Invalid Username. Must be atleast ${this.MIN_USERNAME_LENGTH} char`,
      };
    }

    if (password.length < this.MIN_PASSWORD_LENGTH) {
      return {
        valid: false,
        msg: `Invalid Password. Must be atleas ${this.MIN_PASSWORD_LENGTH} char`,
      };
    }

    return {
      valid: true,
    };
  }

  private async populateUsersForeignEntity(user: User) {
    await user.threads.init({ where: { deleted: false } });
    await user.comments.init({ where: { deleted: false } });
  }

  // get the current user based on the authorization token
  @Query(() => UserResponse)
  async me(@Ctx() { em, auth }: AppContext): Promise<UserResponse> {
    if (!auth.valid) {
      return {
        error: "Invalid authentication (please check your authorization token).",
      };
    }

    const user = await em.findOne(User, { id: auth.userId });
    if (!user) {
      return {
        error: "User not Found.",
      };
    }

    // populate users comments and thread
    await this.populateUsersForeignEntity(user);

    return {
      data: user,
    };
  }

  @Query(() => UserResponse)
  async getUserById(@Arg("id") id: string, @Ctx() { em }: AppContext): Promise<UserResponse> {
    // check if id is valid
    if (id.length < 0) {
      return {
        error: "Invalid Id.",
      };
    }

    const user = await em.findOne(User, { id });
    if (!user) {
      return {
        error: "User not found.",
      };
    }

    // populate users comments and thread
    await this.populateUsersForeignEntity(user);

    return {
      data: user,
    };
  }

  @Query(() => UserResponse)
  async getUserByUsername(@Arg("usename") username: string, @Ctx() { em }: AppContext): Promise<UserResponse> {
    //check if inputed username is a valid username
    if (username.length < this.MIN_USERNAME_LENGTH) {
      return {
        error: `Invalid Username. Must be atleast ${this.MIN_USERNAME_LENGTH} char`,
      };
    }

    // check if user exist
    const user = await em.findOne(User, { username });
    if (!user) {
      return {
        error: "User Not Found.",
      };
    }

    // populate users comments and thread
    await this.populateUsersForeignEntity(user);

    return {
      data: user,
    };
  }

  @Mutation(() => UserResponse)
  async register(@Arg("username") username: string, @Arg("password") password: string, @Ctx() { em }: AppContext): Promise<UserResponse> {
    // check if input is valid
    const checkResult = this.isValid(username, password);
    if (!checkResult.valid) {
      return {
        error: checkResult.msg,
      };
    }

    // check if username already registered
    const user = await em.findOne(User, { username });
    // user already registered
    if (user) {
      return {
        error: "User already registered",
      };
    }

    // valid new user
    const hashedPassword = await argon2.hash(password);
    const newUser = em.create(User, { username, password: hashedPassword });
    await em.persistAndFlush(newUser);

    const result = (await em.find(User, { id: newUser.id }))[0];

    // populate users comments and thread
    await this.populateUsersForeignEntity(result);

    // generate new Auth Token
    const authorizationToken = createToken(newUser.id);

    return { data: result, authorizationToken };
  }

  @Mutation(() => UserResponse)
  async login(@Arg("username") username: string, @Arg("password") password: string, @Ctx() { em }: AppContext): Promise<UserResponse> {
    // check if input is valid
    const checkedInput = this.isValid(username, password);
    if (!checkedInput.valid) {
      return {
        error: checkedInput.msg,
      };
    }

    const usersWithSameUsername = await em.findOne(User, { username }, ["threads", "comments"]);
    // check if user exists
    if (!usersWithSameUsername) {
      return {
        error: "User doesn't exists.",
      };
    }

    // check if password is valid
    const validPassword = await argon2.verify(usersWithSameUsername.password, password);
    if (!validPassword) {
      return {
        error: "Invalid Password.",
      };
    }

    // populate users comments and thread
    await this.populateUsersForeignEntity(usersWithSameUsername);

    // create authorization token
    const authorizationToken = createToken(usersWithSameUsername.id);

    return {
      data: usersWithSameUsername,
      authorizationToken,
    };
  }
}
