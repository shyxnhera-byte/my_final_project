const canvas = document.getElementById("salesChart");
const ctx = canvas.getContext("2d") // stores 2d drawing tools for actual drawing

//match canvas resolution to its actual rendered size
// Makes canvas internal drawing grid match its actual displayed page
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

//to adjust spacing around
const padding = 60;

//tells canvas to start tracking a new shape
ctx.beginPath();

//y axis (vertical line)
ctx.moveTo(padding, padding); //move invisible pen to a staring point without drawing(60,60)
//starting(60pixels from  left, 60 from top)
ctx.lineTo(padding, canvas.height - padding); //starts drawing from current pstn to total canvas height - 60
//pen already at the botton...no need of moveTo
//x axis 
ctx.lineTo(canvas.width - padding, canvas.height - padding); //draw to right till

ctx.strokeStyle = "white"; // for outlines
ctx.lineWidth = 2; //thickness
ctx.stroke(); //calls the stroke method to draw the path we've rendered

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const sales = [120, 180, 150, 220, 190, 260, 240];

ctx.fillStyle = "white"; //color when filling in text n shapes
days.forEach((day, index) => {
  const x = padding + index * ((canvas.width - padding * 2 ) / (days.length - 1));
  //ensures we dont start at the edge...divide available space by the number of spaces
  ctx.fillText(day, x, canvas.height - padding + 25);
});  // fillText(text , x, y)draws actual txt in a specific coordinate

const maxSales = Math.max(...sales); //find largest sale in array sales ...spread numbers individually
const chartHeight = canvas.height - padding * 2;

//map goes thro each sale at a time...for each we'll calculate x and y pstn
const points = sales.map((sale,index) => {
    const x = padding + index * ((canvas.width - padding * 2)/(sales.length - 1));
    const y = canvas.height - padding - (sale / maxSales) * chartHeight;
    //  bcoz canvas y coordinates increase downward
    return {x, y}
    //points end up like [{x: 280, y: 300}]
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
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2); // arc(x, y, radius, startAngle, endAngle)
    ctx.fillStyle = "white";
    ctx.fill(); //fills circle with current fillStyle
});
/*
points.forEach((point, index) => {
    ctx.font = "16px Arial"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText(sales[index], point.x, point.y - 12);
})
*/
const yLabels = [0, 50, 100, 150, 200, 250, 300];
yLabels.forEach((value) => {
    const y = canvas.height - padding - (value / maxSales) * chartHeight;
    ctx.font = "14px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "right"; //relative to x coordinate

    ctx.fillText(`$${value}`, padding - 10, y + 5);
})

//product data
const products = [
    {
        id: 1,
        name: "Bread",
        category: "Bakery",
        buyingPrice: 0.80,
        sellingPrice: 1.40,
        quantity: 32,
        lowStock: 5
    },
    {
        id: 2,
        name: "Milk",
        category: "Dairy",
        buyingPrice: 1.10,
        sellingPrice: 1.50,
        quantity: 4,
        lowStock: 5,
    },
    {
        id: 3,
        name: "Cooking Oil"
        category: "Pantry"
        buyingPrice: 2.50,
        sellingPrice: 3.20,
        quantity: 0,
        lowStock: 5
    }
];

