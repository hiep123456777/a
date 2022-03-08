import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from "./userEntity";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ){

  }
  async Create(data:any): Promise<User>{
    return this.userRepository.save(data);
  }
  async FindOne(condition:any): Promise<User>{
    return this.userRepository.save(condition);
  }
}
