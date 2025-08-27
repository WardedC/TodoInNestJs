import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { TodoItemModule } from './todo-item/todo-item.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TodoModule, TodoItemModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db.kxcwgfgmfahtcajagwhv.supabase.co',
      port: 5432,
      username: 'postgres',
      password: 'qZn9ptrO9z3IqYUZ3y7k',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
