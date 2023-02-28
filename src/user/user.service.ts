import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { encodePassword } from 'src/passwordEncryption/bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(userDetails: CreateUserDto) {
    const password = encodePassword(userDetails.password);
    console.log('New Post Password:', password);
    const newUser = this.userRepository.create({
      ...userDetails,
      password,
    });
    return this.userRepository.save(newUser);
  }
  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  findOneByName(name: string) {
    return this.userRepository.findOne({
      where: {
        name: name,
      },
    });
  }

  update(id: number, updateUserDetails: UpdateUserDto) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
