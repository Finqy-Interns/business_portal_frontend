export const getPreviousMonth = () => {
    // Get the current date
    const currentDate = new Date();

    // Get the current month and year
    const currentMonth = currentDate.getMonth();

    // Calculate the previous month
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    // Get the name of the previous month
    const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const previousMonthName = months[previousMonth];

    // Use the previousMonthName in your code to set the headers dynamically
    return previousMonthName
}
