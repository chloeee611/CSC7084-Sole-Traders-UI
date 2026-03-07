// eslint-disable-next-line no-unused-vars
function createBarChart(labels, counts, title) {
    const chartdata = {
        labels,
        datasets: [
            {
                data: counts,
                backgroundColor: "#36924d",
                hoverOffset: 10,
                spacing: 2,
            },
        ],
    };

    const chartconfig = {
        type: "bar",
        data: chartdata,
        options: {
            ticks: {
                precision: 0,
            },
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                    postion: "top",
                },
                tooltip: { enabled: true },
                title: {
                    display: true,
                    text: title,
                    font: { size: 24 },
                },
            },
        },
    };

    return chartconfig;
}

// eslint-disable-next-line no-unused-vars
function createPieChart(labels, counts, title) {
    const chartdata = {
        labels,
        datasets: [
            {
                data: counts,
                hoverOffset: 10,
                spacing: 2,
            },
        ],
    };

    const chartconfig = {
        type: "pie",
        data: chartdata,
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    postion: "bottom",
                },
                tooltip: { enabled: true },
                title: {
                    display: true,
                    text: title,
                    font: { size: 24 },
                },
            },
        },
    };

    return chartconfig;
}
