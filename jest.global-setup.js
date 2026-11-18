// Pin the time zone so local-date logic (sighting dates) is the same on every machine.
module.exports = async () => {
  process.env.TZ = 'Asia/Colombo';
};
