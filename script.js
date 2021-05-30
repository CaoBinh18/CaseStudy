const Width = 1350;
const Height = 700;
const ParSize = 7;
const ParChangeSize = 0.1;
const ParChangeSpeed = 0.5;
const Acceleration = 0.13;
const DotSizeSpeed = 0.2;
const DotAlphaSpeed = 0.07;
const ParNumberBullet = 20;

class particle {
    constructor(bullet, degree) {
        this.bullet = bullet;
        this.ctx = bullet.ctx;
        this.degree = degree;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.color = this.bullet.color;
        this.size = ParSize;
        this.speed = Math.random() * 2 + 10;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;
        this.dots = [];
    }
    update() {
        this.speed -= ParChangeSpeed;
        if (this.speed < 0) {
            this.speed = 0;
        }

        this.fallSpeed += Acceleration;  // Tăng tốc độ rơi hạt pháo hoa

        this.speedX = this.speed * Math.cos(this.degree);
        this.speedY = this.speed * Math.sin(this.degree) + this.fallSpeed;

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > ParChangeSize) {
            this.size -= ParChangeSize;
        }
        // các hạt con của pháo hoa
        if (this.size > 0) {
            this.dots.push({
                x: this.x, y: this.y, alpha: 1, size: this.size
            });
        }

        this.dots.forEach(dot => {
            dot.size -= DotSizeSpeed;
            dot.alpha -= DotAlphaSpeed;
        });

        this.dots = this.dots.filter(dot => {
            return dot.size > 0;
        });

        if (this.dots.length == 0) {
            this.remove();
        }
    }

    remove() {
        this.bullet.particles.splice(this.bullet.particles.indexOf(this), 1);        // xóa hạt p/h hiện tại sau khi tàn
    }

    draw() {
        this.dots.forEach(dot => {
            this.ctx.fillStyle = 'rgba(' + this.color + ', ' + dot.alpha + ')';
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.ctx.fill();
        })
    }
}

class bullet {
    constructor(fireworks) {
        this.fireworks = fireworks;
        this.ctx = fireworks.ctx;
        this.x = Math.random() * Width;
        this.y = Math.random() * Height / 2;
        this.color = Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255);

        this.particles = [];
        let bulletDegree = Math.PI * 2 / ParNumberBullet;
        for (let i = 0; i < ParNumberBullet; i++) {
            let newParticle = new particle(this, i * bulletDegree);
            this.particles.push(newParticle);
        }
    }
    remove() {
        this.fireworks.bullets.splice(this.fireworks.bullets.indexOf(this), 1);
    }

    update() {
        if (this.particles.length == 0) {
            this.remove();
        }
        this.particles.forEach(particle => particle.update());
    }

    draw() {
        this.particles.forEach(particle => particle.draw());
    }
}

class fireworks {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = Width;
        this.canvas.height = Height;
        document.body.appendChild(this.canvas);

        this.bullets = [];
        setInterval(() => {
            let newBullet = new bullet(this);
            this.bullets.push(newBullet);
        }, 400);

        this.loop();
    }
    loop() {
        this.bullets.forEach(bullet => bullet.update());  // lặp từng bullet
        this.draw();
        setTimeout(() => this.loop(), 20);          // set thời gian chạy lại vòng lặp
    }
    clearScreen() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, Width, Height);
    }
    draw() {
        this.clearScreen();
        this.bullets.forEach(bullet => bullet.draw());

    }
}

let p = new fireworks();