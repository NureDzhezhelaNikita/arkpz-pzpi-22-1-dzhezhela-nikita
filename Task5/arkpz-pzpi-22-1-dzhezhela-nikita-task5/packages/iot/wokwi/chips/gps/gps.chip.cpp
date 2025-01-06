#include "wokwi-api.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SECOND 1000000

const char gps_data[][80] = {
    "$GPGGA,172914.049,2327.985,S,05150.410,W,1,12,1.0,0.0,M,0.0,M,,*60\r\n",
    "$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30\r\n",
    "$GPRMC,172914.049,A,2327.985,S,05150.410,W,009.7,025.9,060622,000.0,W*74\r\n",
    "$GPGGA,172915.049,2327.982,S,05150.409,W,1,12,1.0,0.0,M,0.0,M,,*6E\r\n",
    "$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30\r\n",
    "$GPRMC,172915.049,A,2327.982,S,05150.409,W,009.7,025.9,060622,000.0,W*7A\r\n",
    "$GPGGA,172916.049,2327.980,S,05150.408,W,1,12,1.0,0.0,M,0.0,M,,*6E\r\n",
    "$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30\r\n",
    "$GPRMC,172916.049,A,2327.980,S,05150.408,W,009.7,025.9,060622,000.0,W*7A\r\n",
    "$GPGGA,172917.049,2327.977,S,05150.406,W,1,12,1.0,0.0,M,0.0,M,,*69\r\n",
    "$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30\r\n",
    "$GPRMC,172917.049,A,2327.977,S,05150.406,W,009.7,025.9,060622,000.0,W*7D\r\n",
    "$GPGGA,172918.049,2327.975,S,05150.405,W,1,12,1.0,0.0,M,0.0,M,,*67\r\n",
    "$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30\r\n",
    "$GPRMC,172918.049,A,2327.975,S,05150.405,W,009.7,025.9,060622,000.0,W*73\r\n",
    "$GPGGA,172919.049,2327.973,S,05150.404,W,1,12,1.0,0.0,M,0.0,M,,*61\r\n",
    "$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30\r\n",
    "$GPRMC,172919.049,A,2327.973,S,05150.404,W,009.7,025.9,060622,000.0,W*75\r\n",
    "$GPGGA,172920.049,2327.970,S,05150.403,W,1,12,1.0,0.0,M,0.0,M,,*6F\r\n",
    "$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30\r\n",
    "$GPRMC,172920.049,A,2327.970,S,05150.403,W,009.7,025.9,060622,000.0,W*7B\r\n",
    "$GPGGA,172921.049,2327.968,S,05150.402,W,1,12,1.0,0.0,M,0.0,M,,*66\r\n",
    "$GPGSA,A,3,01,02,03,04,05,06,07,08,09,10,11,12,1.0,1.0,1.0*30\r\n",
};

#define NUM_MESSAGES (sizeof(gps_data) / sizeof(gps_data[0]))

typedef struct
{
  uart_dev_t uart;
  uint32_t message_index;
  pin_t tx_pin;
  pin_t rx_pin;
} chip_state_t;

static void timer_callback(void *user_data)
{
  chip_state_t *state = (chip_state_t *)user_data;

  printf("Sending GPS message %d: %s", state->message_index, gps_data[state->message_index]);

  const char *message = gps_data[state->message_index];
  uart_write(state->uart, (uint8_t *)message, strlen(message));

  state->message_index = (state->message_index + 1) % NUM_MESSAGES;
}

void chip_init()
{
  chip_state_t *state = malloc(sizeof(chip_state_t));
  state->message_index = 0;

  state->tx_pin = pin_init("TX", OUTPUT);
  state->rx_pin = pin_init("RX", INPUT);

  const uart_config_t uart_config = {
      .tx = state->tx_pin,
      .rx = state->rx_pin,
      .baud_rate = 9600,
      .user_data = state};
  state->uart = uart_init(&uart_config);

  const timer_config_t timer_config = {
      .callback = timer_callback,
      .user_data = state};
  timer_t timer = timer_init(&timer_config);

  timer_start(timer, SECOND, true);

  printf("GPS Mock initialized. Starting to send data...\n");
}