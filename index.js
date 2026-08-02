const canvas = document.getElementById("salesChart");
const ctx = canvas.getContext("2d")

//match canvas resolution to its actual rendered size
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const padding = 60;

ctx.beginPath();

//y axis (vertical line)
ctx.moveTo(padding, padding);
ctx.lineTo(padding, canvas.height - padding);

//x axis 
ctx.lineTo(canvas.width - padding, canvas.height - padding);

ctx.strokeStyle = "white";
ctx.lineWidth = 2;
ctx.stroke();

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const sales = [120, 180, 150, 220, 190, 260, 240];
ctx.fillStyle = "white";
days.forEach((day, index) => {
  const x = padding + index * ((canvas.width - padding * 2 ) / (days.length - 1));

  ctx.fillText(day, x, canvas.height - padding + 25);
});
const maxSales = Math.max(...sales);
const chartHeight = canvas.height - padding * 2;

const points = sales.map((sale,index) => {
    const x = padding + index * ((canvas.width - padding * 2)/(sales.length - 1));
    const y = canvas.height - padding - (sale / maxSales) * chartHeight;
    return {x, y}
});

ctx.beginPath();
ctx.moveTo(points[0].x, points[0].y);
points.forEach((point) => {
    ctx.lineTo(point.x, point.y);
});

ctx.strokeStyle = "white";
ctx.lineWidth = 3;
ctx.stroke();

points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
});
points.forEach((point, index) => {
    ctx.font = "16px Arial"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText(sales[index], point.x, point.y - 12);
})

const yLabels = [0, 50, 100, 150, 200, 250, 300];
yLabels.forEach((value) => {
    const y = canvas.height - padding - (value / maxSales) * chartHeight;
    ctx.font = "14px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "right";

    ctx.fillText(`$${value}`, padding - 10, y + 5);
})
