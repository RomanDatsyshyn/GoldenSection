const goldenRatioMinimum = (fn, a, b, ε) => {
  let html = "";
  let html2 = `<p>Мінімум функції f(x) на відрізку [${a.toFixed(
    1
  )}; ${b.toFixed(1)}] знаходиться в точці x = `;

  let values = [];
  let i = 1;

  ε = ε || 1e-8;

  let φ = (-1 + Math.sqrt(5)) / 2;

  let x1 = a + (1 - φ) * (b - a);
  let x2 = b - (1 - φ) * (b - a);

  let A = fn(x1);
  let B = fn(x2);

  values.push({
    iteration: i,
    a: a.toFixed(5),
    b: b.toFixed(5),
    difference: (b - a).toFixed(5),
    x1: x1.toFixed(5),
    x2: x2.toFixed(5),
    fx1: A.toFixed(5),
    fx2: B.toFixed(5),
  });

  html += `<tr>
  <th scope="row">${i}</th>
  <td>${a.toFixed(5)}</td>
  <td>${b.toFixed(5)}</td>
  <td>${(b - a).toFixed(5)}</td>
  <td>${x1.toFixed(5)}</td>
  <td>${x2.toFixed(5)}</td>
  <td>${A.toFixed(5)}</td>
  <td>${B.toFixed(5)}</td>
</tr>`;

  while (b - a > ε) {
    i++;
    if (A < B) {
      b = x2;
      x2 = x1;
      B = A;
      x1 = a + (1 - φ) * (b - a);
      A = fn(x1);
    } else {
      a = x1;
      x1 = x2;
      A = B;
      x2 = b - (1 - φ) * (b - a);
      B = fn(x2);
    }

    values.push({
      iteration: i,
      a: a.toFixed(5),
      b: b.toFixed(5),
      difference: (b - a).toFixed(5),
      x1: x1.toFixed(5),
      x2: x2.toFixed(5),
      fx1: A.toFixed(5),
      fx2: B.toFixed(5),
    });

    html += `<tr>
    <th scope="row">${i}</th>
    <td>${a.toFixed(5)}</td>
    <td>${b.toFixed(5)}</td>
    <td>${(b - a).toFixed(5)}</td>
    <td>${x1.toFixed(5)}</td>
    <td>${x2.toFixed(5)}</td>
    <td>${A.toFixed(5)}</td>
    <td>${B.toFixed(5)}</td>
  </tr>`;
  }

  let x = (a + b) / 2;
  x = Math.abs(x) < 1e-6 ? 0 : x;

  html2 += `${x.toFixed(5)} і f(${x.toFixed(5)}) = ${fn(x).toFixed(5)}</p>`;

  document.getElementById("math").innerHTML = html;
  document.getElementById("math2").innerHTML = html2;

  return {
    x: x,
    y: fn(x),
    values: values,
  };
};

const minimize = () => {
  let getHtmlValue = document.getElementById("data").value;
  let data = getHtmlValue.split(",").map(String);

  let range = data[1].split(";").map(String);

  let a = range[0].split("[");
  a = parseFloat(a[1]);

  let b = range[1].split("]");
  b = parseFloat(b[0]);

  draw(data[0], a, b);

  let result = goldenRatioMinimum(
    (x) => {
      return eval(data[0]);
    },
    a,
    b,
    parseFloat(data[2])
  );
};

const draw = (exp, a, b) => {
  try {
    const expr = math.compile(exp);

    const xValues = math.range(a, b, 0.01).toArray();
    const yValues = xValues.map(function (x) {
      return expr.evaluate({ x: x });
    });

    const trace1 = {
      x: xValues,
      y: yValues,
      type: "scatter",
    };
    const data = [trace1];
    Plotly.newPlot("plot", data);
  } catch (err) {
    console.error(err);
    alert(err);
  }
};
