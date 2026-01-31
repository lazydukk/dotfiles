import React, { useState, useEffect } from "https://esm.sh/react@18?dev";
import { createRoot } from "https://esm.sh/react-dom@18/client?dev";
import * as zebar from "https://esm.sh/zebar@2";

const providers = zebar.createProviderGroup({
  network: { type: "network" },
  glazewm: { type: "glazewm" },
  cpu: { type: "cpu" },
  date: { type: "date", formatting: "EEE d MMM  TT" },
  battery: { type: "battery" },
  memory: { type: "memory" },
  audio: { type: "audio" },
  weather: { type: "weather",latitude: 6.105367, longitude: 80.152009},
  media: { type: "media", refreshinterval: 100 },
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
    const maxLength = 40;

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
      availableLength - truncatedTitle.length
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
    switch (networkOutput.defaultInterface?.type) {
      case "ethernet":
        return <i className="nf nf-fa-ethernet"></i>;
      case "wifi":
        if (networkOutput.defaultGateway?.signalStrength >= 80) {
          return <i className="nf nf-md-wifi_strength_4"></i>;
        } else if (networkOutput.defaultGateway?.signalStrength >= 65) {
          return <i className="nf nf-md-wifi_strength_3"></i>;
        } else if (networkOutput.defaultGateway?.signalStrength >= 40) {
          return <i className="nf nf-md-wifi_strength_2"></i>;
        } else if (networkOutput.defaultGateway?.signalStrength >= 25) {
          return <i className="nf nf-md-wifi_strength_1"></i>;
        } else {
          return <i className="nf nf-md-wifi_strength_outline"></i>;
        }
      default:
        return <i className="nf nf-md-wifi_strength_off_outline"></i>;
    }
  }

  // Get icon to show for how much of the battery is charged.
  function getBatteryIcon(batteryOutput) {
    if (batteryOutput.chargePercent > 90)
      return <i className="nf nf-fa-battery_4"></i>;
    if (batteryOutput.chargePercent > 70)
      return <i className="nf nf-fa-battery_3"></i>;
    if (batteryOutput.chargePercent > 40)
      return <i className="nf nf-fa-battery_2"></i>;
    if (batteryOutput.chargePercent > 20)
      return <i className="nf nf-fa-battery_1"></i>;
    return <i className="nf nf-fa-battery_0"></i>;
  }

  // Get icon to show for current weather status.
  function getWeatherIcon(weatherOutput) {
    switch (weatherOutput.status) {
      case "clear_day":
        return <i className="nf nf-weather-day_sunny"></i>;
      case "clear_night":
        return <i className="nf nf-weather-night_clear"></i>;
      case "cloudy_day":
        return <i className="nf nf-weather-day_cloudy"></i>;
      case "cloudy_night":
        return <i className="nf nf-weather-night_alt_cloudy"></i>;
      case "light_rain_day":
        return <i className="nf nf-weather-day_sprinkle"></i>;
      case "light_rain_night":
        return <i className="nf nf-weather-night_alt_sprinkle"></i>;
      case "heavy_rain_day":
        return <i className="nf nf-weather-rain"></i>;
      case "heavy_rain_night":
        return <i className="nf nf-weather-night_alt_rain_mix"></i>;
      case "snow_day":
        return <i className="nf nf-weather-day_snow"></i>;
      case "snow_night":
        return <i className="nf nf-weather-night_alt_snow"></i>;
      case "thunder_day":
        return <i className="nf nf-weather-day_lightning"></i>;
      case "thunder_night":
        return <i className="nf nf-weather-night_alt_lightning"></i>;
    }
  }

  return (
    <div className="app">
      <div className="left">
        {output.glazewm && (
          <div className="workspaces">
            {output.glazewm.currentWorkspaces.map((workspace) => (
              <button
                className={`workspace ${workspace.hasFocus && "focused"} ${
                  workspace.isDisplayed && "displayed"
                }`}
                onClick={() =>
                  output.glazewm.runCommand(
                    `focus --workspace ${workspace.name}`
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
        <div className="time">{output.date?.formatted}</div>
        <div className="sep">|</div>
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
                    `wm-disable-binding-mode --name ${bindingMode.name}`
                  )
                }
              >
                {bindingMode.displayName ?? bindingMode.name}
              </button>
            ))}

            <button
              className={`tiling-direction nf ${
                output.glazewm.tilingDirection === "horizontal"
                  ? "nf-md-swap_horizontal"
                  : "nf-md-swap_vertical"
              }`}
              onClick={() =>
                output.glazewm.runCommand("toggle-tiling-direction")
              }
            ></button>
          </>
        )}

        {output.network && (
          <div className="network">
            {getNetworkIcon(output.network)}
            {output.network.defaultGateway?.ssid}
          </div>
        )}

        {output.memory && (
          <div className="memory">
            <i className="nf nf-fae-chip"></i>
            {Math.round(output.memory.usage)}%
          </div>
        )}

        {output.cpu && (
          <div className="cpu">
            <i className="nf nf-md-cpu_64_bit"></i>

            {/* Change the text color if the CPU usage is high. */}
            <span className={output.cpu.usage > 85 ? "high-usage" : ""}>
              {Math.round(output.cpu.usage)}%
            </span>
          </div>
        )}

        {output.battery && (
          <div className="battery">
            {/* Show icon for whether battery is charging. */}
            {output.battery.isCharging && (
              <i className="nf nf-md-power_plug charging-icon"></i>
            )}
            {getBatteryIcon(output.battery)}
            {Math.round(output.battery.chargePercent)}%
          </div>
        )}

        {output.weather && (
          <div className="weather">
            {getWeatherIcon(output.weather)}
            {Math.round(output.weather.celsiusTemp)}°C
          </div>
        )}
      </div>
    </div>
  );
}
