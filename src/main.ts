interface Circle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
}


function start(): void {

  const canvas = document.getElementById("scene");

  const color = document.getElementById("color");

  const toggle = document.getElementById("toggle");

  const reset = document.getElementById("reset");

  const selected = document.getElementById("selected");

  const speed = document.getElementById("speed");

  const apply = document.getElementById("apply");

  const status = document.getElementById("status");

  const message = document.getElementById("message");


  if (
    !(canvas instanceof HTMLCanvasElement) ||
    !(color instanceof HTMLInputElement) ||
    !(toggle instanceof HTMLButtonElement) ||
    !(reset instanceof HTMLButtonElement) ||
    !(selected instanceof HTMLSelectElement) ||
    !(speed instanceof HTMLInputElement) ||
    !(apply instanceof HTMLButtonElement) ||
    !(status instanceof HTMLParagraphElement) ||
    !(message instanceof HTMLParagraphElement)
  ) {
    throw new Error("Required page elements are missing");
  }


  const ctx = canvas.getContext("2d");


  if (ctx === null) {
    throw new Error("Canvas 2D is unavailable");
  }



  const initialCircles: readonly Circle[] = [

    {
      x: 80,
      y: 90,
      radius: 20,
      color: "#2563eb",
      vx: 120,
      vy: 70
    },

    {
      x: 320,
      y: 180,
      radius: 28,
      color: "#dc2626",
      vx: -95,
      vy: 85
    },

    {
      x: 520,
      y: 260,
      radius: 24,
      color: "#16a34a",
      vx: 110,
      vy: -65
    }

  ];



  let circles: Circle[] =
    initialCircles.map((circle) => ({ ...circle }));


  let selectedIndex = 0;


  let running = true;



  const clamp = (
    value: number,
    low: number,
    high: number
  ): number => {

    return Math.max(
      low,
      Math.min(value, high)
    );
  };



  const getSelectedCircle =
    (): Circle | undefined => {

      return circles[selectedIndex];
    };



  const syncInputs = (): void => {

    const circle = getSelectedCircle();


    if (circle === undefined) {
      return;
    }


    selected.value =
      String(selectedIndex);


    color.value =
      circle.color;


    speed.value =
      String(Math.abs(circle.vx));
  };



  const draw = (): void => {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    for (const circle of circles) {

      ctx.fillStyle = circle.color;

      ctx.beginPath();

      ctx.arc(
        circle.x,
        circle.y,
        circle.radius,
        0,
        2 * Math.PI
      );

      ctx.fill();
    }


    const circle = getSelectedCircle();


    if (circle === undefined) {

      status.textContent =
        "Selected circle is unavailable";

      return;
    }


    status.textContent =
      `Circle ${selectedIndex + 1}: ` +
      `x=${circle.x.toFixed(1)}, ` +
      `y=${circle.y.toFixed(1)} ` +
      `| ${running ? "running" : "paused"}`;
  };



  color.addEventListener(
    "input",
    () => {

      const circle =
        getSelectedCircle();


      if (circle === undefined) {
        return;
      }


      circle.color =
        color.value;


      message.textContent = "";
    }
  );

  //iam stopped here because the code is too long. Do you want me to continue? give me enough time :~(

  selected.addEventListener(
    "change",
    () => {

      const index =
        Number(selected.value);


      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= circles.length
      ) {

        message.textContent =
          "Invalid circle selection";

        return;
      }


      selectedIndex = index;


      syncInputs();


      message.textContent = "";
    }
  );



  apply.addEventListener(
    "click",
    () => {

      const raw =
        speed.value.trim();


      const magnitude =
        Number(raw);


      const circle =
        getSelectedCircle();


      if (circle === undefined) {

        message.textContent =
          "Selected circle is unavailable";

        return;
      }


      if (
        raw === "" ||
        !Number.isFinite(magnitude) ||
        magnitude < 0
      ) {

        message.textContent =
          "Enter a valid nonnegative speed";

        return;
      }


      const direction =
        circle.vx < 0 ? -1 : 1;


      circle.vx =
        magnitude === 0
          ? 0
          : direction * magnitude;


      message.textContent =
        `Horizontal speed set to ${magnitude}`;
    }
  );



  toggle.addEventListener(
    "click",
    () => {

      running = !running;


      toggle.textContent =
        running
          ? "Pause"
          : "Resume";


      message.textContent = "";
    }
  );



  reset.addEventListener(
    "click",
    () => {

      circles =
        initialCircles.map(
          (circle) => ({ ...circle })
        );


      selectedIndex = 0;


      running = false;


      toggle.textContent =
        "Resume";


      syncInputs();


      message.textContent = "";
    }
  );



  canvas.addEventListener(
    "pointerdown",
    (event) => {

      const circle =
        getSelectedCircle();


      if (circle === undefined) {
        return;
      }


      const bounds =
        canvas.getBoundingClientRect();


      const x =
        (event.clientX - bounds.left) *
        canvas.width /
        bounds.width;


      const y =
        (event.clientY - bounds.top) *
        canvas.height /
        bounds.height;


      circle.x =
        clamp(
          x,
          circle.radius,
          canvas.width - circle.radius
        );


      circle.y =
        clamp(
          y,
          circle.radius,
          canvas.height - circle.radius
        );


      message.textContent = "";
    }
  );



  let previous:
    number | undefined;



  const frame =
    (now: number): void => {


      const dt =
        previous === undefined
          ? 0
          : Math.min(
              (now - previous) / 1000,
              0.05
            );


      previous = now;



      if (running) {

        for (const circle of circles) {


          circle.x +=
            circle.vx * dt;


          circle.y +=
            circle.vy * dt;



          if (
            circle.x >
            canvas.width - circle.radius
          ) {

            circle.x =
              canvas.width - circle.radius;


            circle.vx =
              -Math.abs(circle.vx);
          }


          else if (
            circle.x <
            circle.radius
          ) {

            circle.x =
              circle.radius;


            circle.vx =
              Math.abs(circle.vx);
          }



          if (
            circle.y >
            canvas.height - circle.radius
          ) {

            circle.y =
              canvas.height - circle.radius;


            circle.vy =
              -Math.abs(circle.vy);
          }


          else if (
            circle.y <
            circle.radius
          ) {

            circle.y =
              circle.radius;


            circle.vy =
              Math.abs(circle.vy);
          }

        }

      }



      draw();


      requestAnimationFrame(frame);
    };



  syncInputs();


  requestAnimationFrame(frame);
}



start();


export {};