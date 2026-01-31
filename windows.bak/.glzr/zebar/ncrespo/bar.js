import React, { useState, useEffect } from "https://esm.sh/react@18?dev";
import { createRoot } from "https://esm.sh/react-dom@18/client?dev";
import * as zebar from "https://esm.sh/zebar@2.6.1";

const providers = zebar.createProviderGroup({
  // cpu: { type: "cpu" },
  // memory: { type: "memory" },
  network: { type: "network", refreshInterval: 7000 },
  glazewm: { type: "glazewm" },
  date: { type: "date", formatting: "EEE MMM d, t" },
  battery: { type: "battery", refreshInterval: 15000 },
  audio: { type: "audio" },
  weather: {
    type: "weather",
    latitude: 34.07005584776311,
    longitude: -118.45003755474067,
  },
  media: { type: "media", refreshInterval: 3000 },
});

createRoot(document.getElementById("root")).render(<App />);

function App() {
  const [output, setOutput] = useState(providers.outputMap);

  useEffect(() => {
    providers.onOutput(() => setOutput(providers.outputMap));
  }, []);

  // ensures title + artist doesnt exceed 70 chars
  function stripMedia(title, artist) {
    const ellipsis = "…";
    const separator = " - ";
    const maxLength = 73;

    // Ensure default values
    if (!title) title = "";
    if (!artist) artist = "";

    // Calculate the available length for title and artist
    const separatorLength = separator.length;
    const availableLength = maxLength - separatorLength;

    // Truncate function
    const truncate = (str, len) => {
      if (str && typeof str === "string") {
        if (str.length > len) {
          return str.slice(0, len - ellipsis.length).trim() + ellipsis;
        }
        return str;
      }
      return "?";
    };

    // Short-circuit: If total length is within limit, no truncation needed
    if (title.length + artist.length <= availableLength) {
      return `${title}${separator}${artist}`;
    }

    // Start truncation loop
    let truncatedTitle = truncate(title, availableLength);
    let truncatedArtist = truncate(
      artist,
      availableLength - truncatedTitle.length,
    );

    // Adjust if combined length still exceeds maxLength
    while (
      truncatedTitle.length + truncatedArtist.length + separatorLength >
      maxLength
    ) {
      if (truncatedTitle.length > truncatedArtist.length) {
        truncatedTitle = truncate(truncatedTitle, truncatedTitle.length - 1);
      } else {
        truncatedArtist = truncate(truncatedArtist, truncatedArtist.length - 1);
      }
    }

    return `${truncatedTitle}${separator}${truncatedArtist}`;
  }

  // Get icon to show for current network status.
  function getNetworkIcon(networkOutput) {
    let iconClass;
    let iconColor;
    switch (networkOutput.defaultInterface?.type) {
      case "ethernet":
        iconClass = "nf nf-md-ethernet_cable";
        iconColor = "red";
        break;
      case "wifi":
        if (networkOutput.defaultGateway?.signalStrength >= 80) {
          iconClass = "nf nf-md-wifi_strength_4";
        } else if (networkOutput.defaultGateway?.signalStrength >= 65) {
          iconClass = "nf nf-md-wifi_strength_3";
        } else if (networkOutput.defaultGateway?.signalStrength >= 40) {
          iconClass = "nf nf-md-wifi_strength_2";
        } else if (networkOutput.defaultGateway?.signalStrength >= 25) {
          iconClass = "nf nf-md-wifi_strength_1";
        } else {
          iconClass = "nf nf-md-wifi_strength_outline";
          iconColor = "red";
        }
        break;
      default:
        iconClass = "nf nf-md-wifi_strength_off_outline";
        iconColor = "red";
    }
    return (
      <i
        className={iconClass}
        style={{ color: iconColor, fontSize: "11px", verticalAlign: "+1px" }}
      ></i>
    );
  }

  // Get icon to show for how much of the battery is charged.
  function getBatteryIcon(batteryOutput) {
    let iconClass = "nf nf-md-battery_0";
    let iconColor = "red"; // Default color (red for low battery)

    if (batteryOutput.chargePercent == 100) {
      iconClass = "nf nf-md-battery";
      iconColor = "#39C559";
    } else if (batteryOutput.chargePercent > 90) {
      iconClass = "nf nf-md-battery_90";
      iconColor = "#39C559";
    } else if (batteryOutput.chargePercent > 80) {
      // 80s
      iconClass = "nf nf-md-battery_80";
      iconColor = "#39C559";
    } else if (batteryOutput.chargePercent > 70) {
      // 70s
      iconClass = "nf nf-md-battery_70";
      iconColor = "yellowgreen";
    } else if (batteryOutput.chargePercent > 60) {
      // 60s
      iconClass = "nf nf-md-battery_60";
      iconColor = "yellowgreen";
    } else if (batteryOutput.chargePercent > 50) {
      // 50s
      iconClass = "nf nf-md-battery_50";
      iconColor = "yellowgreen";
    } else if (batteryOutput.chargePercent > 40) {
      // 40s
      iconClass = "nf nf-md-battery_40";
      iconColor = "yellowgreen";
    } else if (batteryOutput.chargePercent > 30) {
      // 30s
      iconClass = "nf nf-md-battery_30";
      iconColor = "yellowgreen";
    } else if (batteryOutput.chargePercent > 20) {
      // 20s
      iconClass = "nf nf-md-battery_20";
      iconColor = "#FFCE08";
      // teens
    } else if (batteryOutput.chargePercent > 10) {
      iconClass = "nf nf-md-battery_10";
      iconColor = "red";
    } else {
      // single digits
      iconClass = "nf nf-md-battery_outline";
      iconColor = "red";
    }

    return (
      <i
        className={iconClass}
        style={{
          color: iconColor,
          fontSize: "10.5px",
          verticalAlign: "+1px",
        }}
      ></i>
    );
  }

  // Get icon to show for current weather status.
  function getWeatherIcon(weatherOutput) {
    let Icon = "test";
    let IconColor = "white";
    let FontSize = "11px";
    if (!weatherOutput || !weatherOutput.status) {
      return <i style={{ color: "#f9f9f9", fontSize: "12px" }}></i>;
    }
    switch (weatherOutput.status) {
      case "clear_day":
        Icon = " ";
        IconColor = "#fad12f";
        break;
      case "clear_night":
        Icon = "";
        IconColor = "#f9f9f9";
        break;
      case "cloudy_day":
        Icon = "  ";
        IconColor = "#9c9c9c";
        break;
      case "cloudy_night":
        Icon = "  ";
        IconColor = "#9c9c9c";
        break;
      case "light_rain_day":
        Icon = " ";
        IconColor = "#7fb4ca";
        break;
      case "light_rain_night":
        Icon = " ";
        IconColor = "#7fb4ca";
        FontSize = "15px";
        break;
      case "heavy_rain_day":
        Icon = " ";
        IconColor = "#223249";
        break;
      case "heavy_rain_night":
        Icon = " ";
        IconColor = "#223249";
        break;
      case "snow_day":
        Icon = " ";
        IconColor = "#f9f9f9";
        break;
      case "snow_night":
        Icon = " ";
        IconColor = "#f9f9f9";
        break;
      case "thunder_day":
        Icon = " ";
        IconColor = "#223249";
        break;
      case "thunder_night":
        Icon = " ";
        IconColor = "#223249";
        break;
      default:
        Icon = weatherOutput.status;
        IconColor = "#f9f9f9";
        break;
    }
    return (
      <i
        style={{
          color: IconColor,
          fontSize: FontSize,
        }}
      >
        {Icon}
      </i>
    );
  }

  function getVolumeLevelIcon(volumeLevel) {
    let iconColor = "white";
    let iconClass = "nf-md-volume_mute";
    let paddingRight = "3px";
    if (volumeLevel == null) {
      iconClass = " ";
    } else if (volumeLevel == 0) {
      iconClass = "nf-md-volume_variant_off";
      iconColor = "red";
    } else if (volumeLevel <= 15) {
      iconClass = "nf-md-volume_low";
    } else if (volumeLevel < 50) {
      iconClass = "nf-md-volume_medium";
    } else {
      iconClass = "nf-md-volume_high";
      paddingRight = "5px";
    }
    return (
      <i
        className={iconClass}
        style={{
          color: iconColor,
          paddingRight: paddingRight,
        }}
      ></i>
    );
  }

  // returns bluetooth icon if output is not default speakers
  function getAudioOutputIcon(name) {
    let iconClass = "";
    let iconColor = "#808080";
    if (name == null) {
      return " ";
    } else if (name.includes("Speakers (Realtek(R) Audio)")) {
      // iconClass = "nf-md-speaker";
      return "";
    } else {
      // if (name == "Headphones (Nothing Ear (a))")
      iconClass = "nf-md-bluetooth";
      iconColor = "#4c68cb";
    }
    //   return name;
    return (
      <i
        className={iconClass}
        style={{
          color: iconColor,
          fontSize: "14px",
          paddingLeft: "4px",
          verticalAlign: "-1px",
        }}
      ></i>
    );
  }

  return (
    <div className="app">
      <div className="left">
        {output.glazewm && (
          <div className="workspaces">
            {output.glazewm.currentWorkspaces.map((workspace) => (
              <button
                className={`workspace ${workspace.hasFocus && "focused"} ${workspace.isDisplayed && "displayed"}`}
                onClick={() =>
                  output.glazewm.runCommand(
                    `focus --workspace ${workspace.name}`,
                  )
                }
                key={workspace.name}
              >
                {workspace.displayName ?? workspace.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="center">
        <div className="media">
          {/* Checking if position and startTime are both 0 */}
          {(() => {
            const session = output.media?.session;

            if (session == null) {
              return " ";
            } else {
              return (
                <>
                  {session?.isPlaying ? "󰝚 " : "󰐊 "}
                  {stripMedia(session?.title, session?.artist)}
                </>
              );
            }
          })()}
        </div>
      </div>

      <div className="right">
        {output.glazewm && (
          <>
            {output.glazewm.bindingModes.map((bindingMode) => (
              <button
                className="binding-mode"
                key={bindingMode.name}
                onClick={() =>
                  output.glazewm.runCommand(
                    `wm-disable-binding-mode --name ${bindingMode.name}`,
                  )
                }
              >
                {bindingMode.displayName ?? bindingMode.name}
              </button>
            ))}

            <button
              className={`tiling-direction nf ${output.glazewm.tilingDirection === "horizontal" ? "nf-cod-split_horizontal" : "nf-cod-split_vertical"}`}
              onClick={() =>
                output.glazewm.runCommand("toggle-tiling-direction")
              }
              style={{ fontSize: "10.5px" }}
            ></button>
          </>
        )}

        {output.weather && (
          <div className="weather">
            {getWeatherIcon(output.weather)}
            {"  "}
            {Math.round(output.weather.fahrenheitTemp)}°F
          </div>
        )}

        {output.network && (
          <div className="network">
            {getNetworkIcon(output.network)}
            {/* this displays the network name */}{" "}
            {/* {output.network.defaultGateway?.ssid} */}
          </div>
        )}

        {output.audio?.defaultPlaybackDevice && (
          <div className="audio">
            {getVolumeLevelIcon(output.audio.defaultPlaybackDevice.volume)}
            {output.audio.defaultPlaybackDevice.volume}
            {getAudioOutputIcon(output.audio.defaultPlaybackDevice.name)}
          </div>
        )}

        {output.battery && (
          <div className={`battery ${output.battery.isCharging && "charging"}`}>
            {output.battery.isCharging && (
              <i
                style={{
                  color: "#fad12f",
                  fontSize: "10px",
                  paddingRight: "2px",
                  verticalAlign: "+1px",
                }}
              >
                
              </i>
            )}
            {!output.battery.isCharging && getBatteryIcon(output.battery)}
            {" " + Math.round(output.battery.chargePercent)}%
          </div>
        )}

        <div className="date">{output.date?.formatted}</div>
      </div>
    </div>
  );
}
