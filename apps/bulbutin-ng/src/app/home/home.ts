import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from '../toolbar/toolbar';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [Toolbar, Navbar, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
