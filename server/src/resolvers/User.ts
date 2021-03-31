import { Arg, ClassType, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import AppContext from "../AppContext";
import AppContext from "../AppContext";
import { User } from "../entities/User";
import argon2 from "argon2";
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

import JWT from "jsonwebtoken";
import { __jwt_secret__ } from "../env";
import { createToken } from "../authentication";

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
    const user = await em.find(User, { username });
    // user already registered
    if (user.length !== 0) {
      return {
        error: "User already registered",
      };
    }

    // valid new user
    const hashedPassword = await argon2.hash(password);
    const newUser = em.create(User, { username, password: hashedPassword });
    await em.persistAndFlush(newUser);

    const result = (await em.find(User, { id: newUser.id }))[0];

    // generate new Auth Token
    const authorizationToken = createToken(newUser.id);

    return { data: result, authorizationToken };
  }

  @Query(() => UserResponse)
  async login(@Arg("username") username: string, @Arg("password") password: string, @Ctx() { em }: AppContext): Promise<UserResponse> {
    // check if input is valid
    const checkedInput = this.isValid(username, password);
    if (!checkedInput.valid) {
      return {
        error: checkedInput.msg,
      };
    }

    const usersWithSameUsername = await em.find(User, { username });
    // check if user exists
    if (usersWithSameUsername.length === 0) {
      return {
        error: "User doesn't exists.",
      };
    }

    const user = usersWithSameUsername[0];
    // check if password is valid
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return {
        error: "Invalid Password.",
      };
    }

    // create authorization token
    const authorizationToken = createToken(user.id);

    return {
      data: user,
      authorizationToken,
    };
  }

  // get the current user based on the authorization token
  @Query(() => UserResponse)
  async me(@Ctx() { em, auth }: AppContext): Promise<UserResponse> {
    if (!auth.valid) {
      return {
        error: "Invalid authentication (please check your authorization token).",
      };
    }

    const users = await em.find(User, { id: auth.userId });
    if (users.length === 0) {
      return {
        error: "User not Found.",
      };
    }

    return {
      data: users[0],
    };
  }

  @Query(() => UserResponse)
  async getUserById(@Arg("id") id: string, @Ctx() { em, auth }: AppContext): Promise<UserResponse> {
    // check if user is authorized
    if (!auth.valid) {
      return {
        error: "Not Authorized (please check your authorization token).",
      };
    }

    // check if id is valid
    if (id.length < 0) {
      return {
        error: "Invalid Id.",
      };
    }

    const users = await em.find(User, { id });
    if (users.length === 0) {
      return {
        error: "User not found.",
      };
    }

    return {
      data: users[0],
    };
  }

  @Query(() => UserResponse)
  async getUserByUsername(@Arg("usename") username: string, @Ctx() { em, auth }: AppContext): Promise<UserResponse> {
    // check if user is authorized
    if (!auth.valid) {
      return {
        error: "Not Authorized (please check your authorization token).",
      };
    }

    //check if inputed username is a valid username
    if (username.length < this.MIN_USERNAME_LENGTH) {
      return {
        error: `Invalid Username. Must be atleast ${this.MIN_USERNAME_LENGTH} char`,
      };
    }

    // check if user exist
    const users = await em.find(User, { username });
    if (users.length === 0) {
      return {
        error: "User Not Found.",
      };
    }

    return {
      data: users[0],
    };
  }

  //   @Mutation(() => UserResponse)
  //   async updateUser(@Arg("id") id: string, @Ctx() { em, auth }: AppContext): Promise<UserResponse> {
  //     if (!auth.valid) {
  //       return {
  //         error: "Not Authorized (please check your authorization token)."
  //       };
  //     }

  //     // check if id is valid
  //     if (id.length < 0) {
  //       return {
  //         error: "Invalid Id."
  //       };
  //     }

  //     // check if user exist
  //     const usersWithSameId = await em.find(User, { id });
  //     if (usersWithSameId.length === 0) {
  //       return {
  //         error: "User Not Found."
  //       };
  //     }

  //     const user = usersWithSameId[0];

  //     // check if user is authorized to update the profile
  //     if((user.id === auth.userId) && (user.id === id)) {
  //         // update the user profile

  //     }
  //   }
}
