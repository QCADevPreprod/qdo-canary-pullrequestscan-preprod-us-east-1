
#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define BUFSIZE 256
#define FMT "whatever"

void noncompliant1(char *string)
{
    char buf[BUFSIZE];
    char fmt[] = "whatever";
    // printf statement that prints the address of the local variable buf. This exposes the memory address of the buffer buf,
    //  ruleid: cpp-memory-address-exposure
    printf("address: %p\n", buf);
}

void noncompliant2(char *string)
{
    char buf[BUFSIZE];
    char fmt[] = "whatever";
    // the format string "address: %x\n" expects an integer argument, but string is a pointer to a character. This incorrect usage of the format specifier %x
    //  ruleid: cpp-memory-address-exposure
    sprintf(buf, "address: %x\n", string);
}

struct Node
{
};

__uint32_t *drand()
{
    // code
}

char *noncompliant3(Node *n)
{
    char *buf = (char *)malloc(32);
    if (!buf)
        return NULL;

    memset(buf, 0x0, 32);
    __uint32_t *uval = (__uint32_t *)&buf;

    if (uval == 0)
    {
        uval = drand();
    }
    // ruleid: cpp-memory-address-exposure
    snprintf(buf, 32, "%x", uval);
    return buf;
}

void nonCompliant4()
{
    int var;
    // Printing the memory address directly:
    //  ruleid: cpp-memory-address-exposure
    std::cout << "Memory address of var: " << &var << std::endl;
}

void nonCompliant5(int *ptr)
{
    // Passing memory address to a function directly:
    //  ruleid: cpp-memory-address-exposure
    std::cout << "Memory address: " << ptr << std::endl;
}

void nonCompliant6()
{
    int var;
    // Logging the memory address:
    //  ruleid: cpp-memory-address-exposure
    printf("Memory address of var: %p\n", &var);
}

void compliant1(char *string)
{
    char buf[BUFSIZE];
    char fmt[] = "whatever";
    //ok:cpp-memory-address-exposure
    // Placeholder comment instead of printing the address
    // printf("address: %p\n", buf);
}

void compliant2(char *string)
{
    char buf[BUFSIZE];
    char fmt[] = "whatever";
    // use snprintf to ensure that the buffer buf has enough space to store the formatted string and prevent buffer overflow.
    // Use the correct format specifier '%s' for string
    //ok:cpp-memory-address-exposure
    snprintf(buf, BUFSIZE, "address: %s\n", string);
}

char *compliant3(Node *n)
{
    char *buf = (char *)malloc(32);
    if (!buf)
        return NULL;

    memset(buf, 0x0, 32);
    __uint32_t *uval = (__uint32_t *)&buf;

    if (uval == 0)
    {
        uval = drand();
    }

    // Make the code compliant by printing the value stored at the memory address pointed to by 'uval'
    if (uval != NULL)
    {
        //ok:cpp-memory-address-exposure
        snprintf(buf, 32, "%x", *uval);
    }
    else
    {
        // Handle the case where 'uval' is NULL
        snprintf(buf, 32, "NULL");
    }
    return buf;
}

void compliant4()
{
    int var = 10;
    // Printing the value stored at the memory address:
    //  ok: cpp-memory-address-exposure
    std::cout << "Value of var: " << var << std::endl;
}

void compliant5(int *ptr)
{
    // Using pointers internally without exposing them:
    //  ok: cpp-memory-address-exposure
    std::cout << "Value: " << *ptr << std::endl;
}

void compliant6()
{
    int var = 10;
    // Logging the value stored at the memory address:
    //  ok: cpp-memory-address-exposure
    std::cout << "Value of var: " << var << std::endl;
}

int main()
{
    // Write C++ code here
    std::cout << "Hello world!";

    return 0;
}

/**
 * @file asm_camera.cpp
 * @brief Main
 *
 * This file contains the traditional main() function. See function documentation
 * below for more detail.
 *
 * @copyright Copyright 2019 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 */

/// @cond
#include <cstdio>
#include <sstream>
#include <tuple>
#include <unistd.h>
/// @endcond

#include "bug.hpp"
#include "camera_control.hpp"
#include "log/log.hpp"
#include "scmm.hpp"
#include "shutdown_signal.hpp"
#include "thread_map.hpp"

#include "network/asx_control_msg_service.hpp"
#include "network/eth_interface.hpp"

#include "sensors/types/camera_positions.hpp"
#include "sensors/sensor.h"

#include "app/retcodes.hpp"

#include "app/init.hpp"

#include "safeods_metrics/metrics.h"
#include "safeods_metrics/linux/circular_buffer.h"
#include "safeods_metrics/linux/timestamp_impl.h"
#include "safeods_metrics/linux/udp_sender.h"

namespace asm_camera {

#ifndef GIT_VERSION
#define GIT_VERSION "error_version" /*!< Used for printing version at startup */
#endif

static asm_arguments asm_args;

constexpr std::array<uint8_t, asm_camera::MAX_SENSORS> ARSOM_STREAMS_NONE = {safe_ods::PROFILE_NONE, safe_ods::PROFILE_NONE, safe_ods::PROFILE_NONE, safe_ods::PROFILE_NONE};
constexpr std::array<uint8_t, asm_camera::MAX_SENSORS> ARSOM1_AT_GRADE_STREAMS = {safe_ods::PROFILE_UP_AT_GRADE, safe_ods::PROFILE_FRONT_AT_GRADE, safe_ods::PROFILE_NONE, safe_ods::PROFILE_NONE};
constexpr std::array<uint8_t, asm_camera::MAX_SENSORS> ARSOM1_OVERHEAD_STREAMS = {safe_ods::PROFILE_UP_OVERHEAD, safe_ods::PROFILE_FRONT_OVERHEAD, safe_ods::PROFILE_NONE, safe_ods::PROFILE_NONE};
constexpr std::array<uint8_t, asm_camera::MAX_SENSORS> ARSOM2_AT_GRADE_STREAMS = {safe_ods::PROFILE_RIGHT_AT_GRADE, safe_ods::PROFILE_LEFT_AT_GRADE, safe_ods::PROFILE_NONE, safe_ods::PROFILE_NONE};
constexpr std::array<uint8_t, asm_camera::MAX_SENSORS> ARSOM2_OVERHEAD_STREAMS = ARSOM_STREAMS_NONE;
constexpr std::array<uint8_t, asm_camera::MAX_SENSORS> ARSOM3_AT_GRADE_STREAMS = {safe_ods::PROFILE_REAR_AT_GRADE, safe_ods::PROFILE_NONE, safe_ods::PROFILE_NONE, safe_ods::PROFILE_NONE};
constexpr std::array<uint8_t, asm_camera::MAX_SENSORS> ARSOM3_OVERHEAD_STREAMS = ARSOM_STREAMS_NONE;
constexpr std::array<uint8_t, asm_camera::MAX_SENSORS> ARSOM4_AT_GRADE_STREAMS = ARSOM_STREAMS_NONE;
constexpr std::array<uint8_t, asm_camera::MAX_SENSORS> ARSOM4_OVERHEAD_STREAMS = ARSOM_STREAMS_NONE;

// configuration -> board_id ->> sensor_positions
static std::vector<std::vector<struct board_configuration>> asm_configurations {{ /*!< Supported board configurations, separated by platform type */
     // 0 - pseudoconfiguration used for debugging
    {{
        {safe_ods::DEFAULT_BCID, 1u, {safe_ods::CAMERA_POSITION_PSEUDO, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR}, ARSOM_STREAMS_NONE, ARSOM_STREAMS_NONE}
    }},
    // 1 - Proteus
    {{
        {safe_ods::DEFAULT_BCID, 0u, {asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR}, ARSOM_STREAMS_NONE, ARSOM_STREAMS_NONE},
        {safe_ods::ARSOM1_A72_ID, 2u, {safe_ods::CAMERA_POSITION_UP, safe_ods::CAMERA_POSITION_FRONT, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR}, ARSOM1_AT_GRADE_STREAMS, ARSOM1_OVERHEAD_STREAMS},
        {safe_ods::ARSOM2_A72_ID, 2u, {safe_ods::CAMERA_POSITION_RIGHT, safe_ods::CAMERA_POSITION_LEFT, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR}, ARSOM2_AT_GRADE_STREAMS, ARSOM2_OVERHEAD_STREAMS},
        {safe_ods::ARSOM3_A72_ID, 1u, {safe_ods::CAMERA_POSITION_REAR, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR}, ARSOM3_AT_GRADE_STREAMS, ARSOM3_OVERHEAD_STREAMS},
        {safe_ods::ARSOM4_A72_ID, 0u, {asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR}, ARSOM4_AT_GRADE_STREAMS, ARSOM4_OVERHEAD_STREAMS}
    }},
    // 2 - Proteus 1.6 Alpha
    {{
        {safe_ods::DEFAULT_BCID, 0u, {asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR}, ARSOM_STREAMS_NONE, ARSOM_STREAMS_NONE},
        {safe_ods::ARSOM1_A72_ID, 2u, {safe_ods::CAMERA_POSITION_UP, safe_ods::CAMERA_POSITION_FRONT, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR}, ARSOM1_AT_GRADE_STREAMS, ARSOM1_OVERHEAD_STREAMS},
        {safe_ods::ARSOM2_A72_ID, 2u, {safe_ods::CAMERA_POSITION_RIGHT, safe_ods::CAMERA_POSITION_LEFT, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR}, ARSOM2_AT_GRADE_STREAMS, ARSOM2_OVERHEAD_STREAMS},
        {safe_ods::ARSOM3_A72_ID, 1u, {safe_ods::CAMERA_POSITION_REAR, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR}, ARSOM3_AT_GRADE_STREAMS, ARSOM3_OVERHEAD_STREAMS},
        {safe_ods::ARSOM4_A72_ID, 0u, {asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR, asm_camera::DISABLED_SENSOR}, ARSOM4_AT_GRADE_STREAMS, ARSOM4_OVERHEAD_STREAMS}
    }}
}};

using safe_ods::log_txt;
using safe_ods::camera_set_streaming;
using safe_ods::camera_is_streaming;
using safe_ods::remove_stream_client;

static board_configuration& get_board_config(asm_arguments& arguments)
{
    BUG_ON(asm_configurations.size() > safe_ods::UINT8_MAX_UNSIGNED, "BUG: asm_configurations.size() > UINT8_MAX" );
    BUG_ON_VERBOSE((arguments.camera_platform >= asm_configurations.size()),
                    "Error parsing arguments: Sensor platform %d out of range (0 - %lu)", arguments.camera_platform, asm_configurations.size());

    BUG_ON_VERBOSE((asm_configurations[arguments.camera_platform].size() > safe_ods::UINT8_MAX_UNSIGNED), "BUG: asm_configurations[%u].size() >= UINT8_MAX", arguments.camera_platform);
    BUG_ON_VERBOSE((arguments.board_id >= asm_configurations[arguments.camera_platform].size()),
                    "Error parsing arguments: Board number %u out of range (0 - %lu)", static_cast<uint32_t>(arguments.board_id), asm_configurations[arguments.camera_platform].size());

    return asm_configurations[arguments.camera_platform][arguments.board_id];
}

/**
 * @brief Main function for the application.
 *
 * @note This is separate from main() for UT purposes
 *
 * @param argc Program input argument count
 * @param argv Program input arguments
 * @return Program exit code
 */
static int32_t asm_camera_main(int32_t argc, char **argv)
{
    BUG_ON(((argc < 1) || (argv == nullptr)), "INVALID PROGRAM ARGUMENTS");
    int32_t rc = 0;

    std::ostringstream version_ss;
    version_ss << "ASM camera streaming app, version " << GIT_VERSION << ".\n";
    version_ss << SOURCE_COMMIT_AUDIT << "\n";
    version_ss << BRAZIL_PACKAGE_VERSION_AUDIT;
    const std::string version_cpp_str = version_ss.str();
    const char* version_c_str = version_cpp_str.c_str();

    // Do not use logging functions until after logging is initialized
    std::ignore = printf("%s\n",version_c_str);
    std::thread::id thread_id = std::this_thread::get_id();
    std::string thread_name = "ASMC_MAIN";
    safe_ods::set_thread_name(thread_id, thread_name);

    setbuf(stdout, nullptr);
    setbuf(stderr, nullptr);

    // TODO Set 'log_deletes' to true when ARF-10590 is implemented
    safe_ods::set_safety_critical_memory_params(0u, false);
    safe_ods::enable_safety_critical_mode(false);

    rc = initialize_asm_arguments(argc, argv, asm_args);
    if(rc != safe_ods::RETCODE_NO_ERRORS)
    {
        return rc;
    }

    rc = initialize_logging(asm_args);
    if(rc != safe_ods::RETCODE_NO_ERRORS)
    {
        return rc;
    }

    // Initialize metrics
    safeods::metrics::timestamp_impl metrics_timestamp_provider;
    safeods::metrics::udp_sender metrics_udp_sender;
    safeods::metrics::circular_buffer metrics_buffer;

    if(safeods::metrics::init(metrics_buffer, metrics_timestamp_provider, metrics_udp_sender))
    {
        safe_ods::log_txt(safe_ods::txt_log_level::ARL_ERR, "Error initializing SafeODS metrics. Will quitt.");
        rc = safe_ods::RETCODE_ERROR_ASSERT;
        return rc;
    }

    // Relog the version in the now-initialized logger
    safe_ods::log_txt(safe_ods::txt_log_level::ARL_INFO, "%s", version_c_str);

    const board_configuration& board_config = get_board_config(asm_args);
    safe_ods::log_txt(safe_ods::txt_log_level::ARL_INFO, "Platform: %u Board: %u BCID: %u Sensors: %u ",
                          asm_args.camera_platform, asm_args.board_id, board_config.bcid, board_config.num_sensors);

    rc = initialize_cameras(asm_args, board_config);
    if(rc != safe_ods::RETCODE_NO_ERRORS)
    {
        return rc;
    }

    //These variables are needed for teardown
    int32_t asc_a_stream_client_id = 0;
    int32_t asc_b_stream_client_id = 0;

    rc = initialize_network(asm_args, board_config, asc_a_stream_client_id, asc_b_stream_client_id);
    if(rc != safe_ods::RETCODE_NO_ERRORS)
    {
        return rc;
    }

    if ( !camera_set_streaming(true)) {
        log_txt(safe_ods::txt_log_level::ARL_ERR, "Failed to start streaming");
        return safe_ods::RETCODE_STREAMING_ERROR;
    }

    safe_ods::init_shutdown_signal();

    // Startup ASX Control Message Service
    BUG_ON(!safe_ods::asx_start_service(asm_camera::asm_args.asx_control_udp_in_port, board_config.bcid),
        "ASX Control Message Service failed to start.");

    // Enter Safety Critical Memory Mode (SCMM)
    log_txt(safe_ods::txt_log_level::ARL_INFO, "<<<<<<<<<<<<<<< Entering Safety Critical Mode >>>>>>>>>>>>>>>");
    safe_ods::enable_safety_critical_mode(true);

    do {
        constexpr int sleep_duration_ms = 50;
        std::this_thread::sleep_for(std::chrono::milliseconds(sleep_duration_ms));

        // Send all pending metrics
        std::error_code ec = safeods::metrics::send();
        if (ec) {
            safe_ods::log_txt(safe_ods::txt_log_level::ARL_ERR, "SafeODS metrics send error: %d", ec.value());
        }

        if (!camera_is_streaming()) {
            safe_ods::log_txt(safe_ods::txt_log_level::ARL_ERR, "Sensors are not streaming, exiting");
            rc = safe_ods::RETCODE_STREAMING_ERROR;
            break;
        }
    } while(safe_ods::infinite_loop());

    safe_ods::enable_safety_critical_mode(false);
    log_txt(safe_ods::txt_log_level::ARL_INFO, "<<<<<<<<<<<<<<< Exiting Safety Critical Mode >>>>>>>>>>>>>>>");

    remove_stream_client(asc_a_stream_client_id);
    remove_stream_client(asc_b_stream_client_id);

    safe_ods::dump_thread_map();
    return rc;
}

} // namespace asm_camera

/**
 * @brief Traditional main()
 *
 * @note The asm_camera_main function is essentially what would be the body of this function.
 * It is separate for UT purposes.
 *
 * @param argc Program input argument count
 * @param argv Program input arguments
 * @return Program exit code
 */
int main(int argc, char **argv)
{
    return asm_camera::asm_camera_main(argc, argv);
}