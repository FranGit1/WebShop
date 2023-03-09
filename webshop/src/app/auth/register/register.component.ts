import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../shared/user.model';
import { matchValidator } from '../form-validators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  error: boolean = false;

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl(null, [
        Validators.required,
        matchValidator('repeatPassword', true),
      ]),
      repeatPassword: new FormControl(null, [
        Validators.required,
        matchValidator('password'),
      ]),
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  passwordMatch() {
    return (
      this.registerForm.controls['password'].value ==
      this.registerForm.controls['repeatPassword'].value
    );
  }

  makeid(length: number) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  onRegister() {
    if (this.passwordMatch()) {
      this.error = false;

      const user: User = {
        username: this.registerForm.get('username')?.value,
        password: this.registerForm.get('password')?.value,
        name: this.registerForm.get('name')?.value,
        email: this.registerForm.get('email')?.value,
        id: this.makeid(15),
        role: 1,
      };

      this.userService.addUser(user);
    } else {
      this.error = true;
    }
  }
}
