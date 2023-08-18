import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export const PROJECT_PROGRESS = {
  EXPLORATION: "Exploration",
  KONZEPTION: "Konzeption",
  PROOF_OF_CONCEPT: "Proof of Concept",
};

function ExplorationStep({ label }: { label: string }) {
  return (
    <Box sx={{ width: 40, height: 30, background: "#A4B419", borderRadius: 1 }}>
      <Box
        sx={{
          width: 24,
          height: 24,
          justifyContent: "flex-start",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <Box
          style={{
            width: 24,
            height: 24,
            background: "rgba(0, 0, 0, 0.25)",
            borderRadius: 40,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            display: "inline-flex",
          }}
        >
          <Box
            style={{
              alignSelf: "stretch",
              flex: "1 1 0",
              textAlign: "center",
              color: "white",
              fontSize: 12,
              fontFamily: "***FONT_REMOVED***",
              fontWeight: "400",
              lineHeight: 19.92,
              letterSpacing: 0.4,
              wordWrap: "break-word",
            }}
          >
            1
          </Box>
        </Box>
        <Box />
      </Box>
    </Box>
  );
}

function KonzeptionStep({ label }: { label: string }) {
  return (
    <Box sx={{ width: 39, height: 28, background: "#A4B419", borderRadius: 4 }}>
      <Box
        sx={{
          width: 24,
          height: 24,
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 8,
          display: "inline-flex",
        }}
      >
        <Box
          style={{
            height: 24,
            paddingLeft: 7,
            paddingRight: 7,
            background: "rgba(0, 0, 0, 0.25)",
            borderRadius: 100,
            overflow: "hidden",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            display: "inline-flex",
          }}
        >
          <Box
            style={{
              alignSelf: "stretch",
              flex: "1 1 0",
              textAlign: "center",
              color: "white",
              fontSize: 12,
              fontFamily: "***FONT_REMOVED***",
              fontWeight: "400",
              lineHeight: 19.92,
              letterSpacing: 0.4,
              wordWrap: "break-word",
            }}
          >
            2
          </Box>
        </Box>
        <Box />
      </Box>
    </Box>
  );
}

function POCStep({ label }: { label: string }) {
  return (
    <Box sx={{ width: 39, height: 28, background: "#A4B419", borderRadius: 4 }}>
      <Box
        sx={{
          width: 24,
          height: 24,
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 8,
          display: "inline-flex",
        }}
      >
        <Box
          style={{
            height: 24,
            paddingLeft: 7,
            paddingRight: 7,
            background: "rgba(0, 0, 0, 0.25)",
            borderRadius: 100,
            overflow: "hidden",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            display: "inline-flex",
          }}
        >
          <Box
            style={{
              alignSelf: "stretch",
              flex: "1 1 0",
              textAlign: "center",
              color: "white",
              fontSize: 12,
              fontFamily: "***FONT_REMOVED***",
              fontWeight: "400",
              lineHeight: 19.92,
              letterSpacing: 0.4,
              wordWrap: "break-word",
            }}
          >
            3
          </Box>
        </Box>
        <Box />
      </Box>
    </Box>
  );
}

export default function ProgressStepper() {
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
      <ExplorationStep label="1" />
      <KonzeptionStep label="2" />
      <POCStep label="3" />
    </Stack>
  );
}
